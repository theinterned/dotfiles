import base64
import json
import os
from pathlib import Path
import shlex
import subprocess
import sys
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "script/splunk-mcp"
NOW = 1800000000
WEEK = 7 * 24 * 60 * 60


def token(payload):
    encoded = base64.urlsafe_b64encode(json.dumps(payload).encode()).decode().rstrip("=")
    return f"eyJhbGciOiJIUzI1NiJ9.{encoded}.ZmFrZS1zaWduYXR1cmU"


class SplunkMCPTest(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.home = Path(self.directory.name)
        self.log = self.home / "commands"
        self.cached = token({"exp": NOW + 90 * 86400})
        self.env = {
            "HOME": str(self.home),
            "USER": "fake-user",
            "PATH": str(self.home),
            "COMMAND_LOG": str(self.log),
            "CACHE_TOKEN": self.cached,
            "OP_TOKEN": self.cached,
            "CACHE_READ_STATUS": "0",
            "CACHE_WRITE_STATUS": "0",
            "OP_STATUS": "0",
        }
        self.write_tool("python3", f"""
exec {shlex.quote(sys.executable)} -c 'import sys, time
time.time = lambda: {NOW}
exec(sys.argv[1])' "$2"
""")
        self.write_tool("security", """
printf 'security %s\\n' "$*" >> "$COMMAND_LOG"
case "$1" in
  find-generic-password)
    if [ "${CACHE_USE_WRITTEN:-}" = 1 ] && [ -f "$HOME/cache-input" ]; then
      IFS= read -r cached < "$HOME/cache-input"
      printf '%s' "$cached"
      exit 0
    fi
    printf '%s' "$CACHE_TOKEN"
    exit "$CACHE_READ_STATUS"
    ;;
  add-generic-password)
    /bin/cat > "$HOME/cache-input"
    exit "$CACHE_WRITE_STATUS"
    ;;
  *) exit 99 ;;
esac
""")
        self.write_tool("op", """
printf 'op %s\\n' "$*" >> "$COMMAND_LOG"
printf '%s' "$OP_TOKEN"
if [ "$OP_STATUS" != 0 ]; then
  printf '%s' "$OP_TOKEN" >&2
fi
exit "$OP_STATUS"
""")
        self.write_tool("docker", """
printf 'docker %s\\n' "$*" >> "$COMMAND_LOG"
if [ "$1" = run ]; then
  printf '%s' "$SPLUNK_BEARER_TOKEN" > "$HOME/container-token"
fi
""")
        self.write_tool("tailscale", 'printf "tailscale %s\\n" "$*" >> "$COMMAND_LOG"\n')
        self.write_tool("open", 'printf "open %s\\n" "$*" >> "$COMMAND_LOG"\nexit 99\n')
        self.write_tool("osascript", """
while [ "$1" = -e ]; do shift 2; done
printf 'notify %s | %s\\n' "$1" "$2" >> "$COMMAND_LOG"
""")

    def write_tool(self, name, body):
        path = self.home / name
        path.write_text("#!/bin/sh\n" + body)
        path.chmod(0o755)

    def run_launcher(self, *args):
        result = subprocess.run(
            ["/bin/bash", str(SCRIPT), *args],
            env=self.env, capture_output=True, text=True,
        )
        for value in (self.env["CACHE_TOKEN"], self.env["OP_TOKEN"],
                      self.env.get("SPLUNK_BEARER_TOKEN", "")):
            if value:
                self.assertNotIn(value, result.stdout + result.stderr)
                self.assertNotIn(value, self.commands())
        return result

    def commands(self):
        return self.log.read_text() if self.log.exists() else ""

    def assert_no_services(self):
        for name in ("docker", "tailscale", "open"):
            self.assertNotIn(name + " ", self.commands())

    def assert_started(self, expected, fallback=False):
        self.assertIn("docker info\n", self.commands())
        self.assertIn("tailscale status\n", self.commands())
        self.assertIn("docker run -i --rm ", self.commands())
        self.assertEqual((self.home / "container-token").read_text(), expected)
        if not fallback:
            self.assertNotIn("op ", self.commands())
            self.assertNotIn("add-generic-password", self.commands())

    def notifications(self):
        return [line for line in self.commands().splitlines()
                if line.startswith("notify ")]

    def assert_notified(self, subtitle):
        self.assertIn(
            f"notify {subtitle} | Refresh: bash ~/.dotfiles/script/splunk-mcp --refresh-token",
            self.notifications())

    def assert_fix_steps(self, result):
        self.assertIn("bash ~/.dotfiles/script/splunk-mcp --refresh-token", result.stderr)
        self.assertIn("create or rotate", result.stderr)
        self.assertIn("op://Employee/Splunk token/password", result.stderr)

    def test_valid_cache_starts_without_1password(self):
        result = self.run_launcher()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assert_started(self.cached)
        self.assertNotIn("expires within", result.stderr)
        self.assertEqual(self.notifications(), [])

    def test_expiry_warning_does_not_refresh(self):
        for seconds in (1, WEEK - 1, WEEK, WEEK + 1):
            with self.subTest(seconds=seconds):
                self.env["CACHE_TOKEN"] = token({"exp": NOW + seconds})
                self.log.unlink(missing_ok=True)
                result = self.run_launcher()
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assert_started(self.env["CACHE_TOKEN"])
                self.assertEqual("expires within seven days" in result.stderr,
                                 seconds <= WEEK)
                if seconds <= WEEK:
                    self.assert_fix_steps(result)
                    self.assert_notified("Splunk token expires within seven days.")
                else:
                    self.assertEqual(self.notifications(), [])

    def test_invalid_cache_falls_back_once_and_caches_valid_token(self):
        invalid = [
            "", "not-a-token", "a.@@@@.b", "a.b.c",
            token({"exp": NOW}), token({"exp": NOW - 1}), token({}),
            token({"exp": str(NOW + WEEK)}), token({"exp": True}),
            token({"exp": NOW + 0.5}), token({"exp": -1}),
            token({"exp": 2**64 + NOW + WEEK}),
            token({"nested": {"exp": NOW + WEEK}}), token([]),
        ]
        for value in invalid:
            with self.subTest(value=value):
                self.env["CACHE_TOKEN"] = value
                self.log.unlink(missing_ok=True)
                result = self.run_launcher()
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertIn("cache is malformed or expired", result.stderr)
                self.assertIn("Falling back to 1Password once", result.stderr)
                self.assert_fix_steps(result)
                self.assertEqual(self.commands().count("op read "), 1)
                self.assert_started(self.cached, fallback=True)
                self.assertEqual((self.home / "cache-input").read_text(),
                                 f"{self.cached}\n{self.cached}\n")

    def test_missing_or_unreadable_cache_falls_back_then_uses_cache(self):
        self.env["CACHE_READ_STATUS"] = "44"
        self.env["CACHE_USE_WRITTEN"] = "1"
        result = self.run_launcher()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("missing or unreadable", result.stderr)
        self.assert_fix_steps(result)
        self.assert_notified("Cached token unusable; asking 1Password.")
        self.assert_started(self.cached, fallback=True)
        self.assertEqual(self.commands().count("op read "), 1)
        self.log.unlink()
        result = self.run_launcher()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assert_started(self.cached)
        self.assertNotIn("Falling back", result.stderr)
        self.assertEqual(self.notifications(), [])

    def test_fallback_rejects_invalid_1password_copy_before_services(self):
        self.env["CACHE_READ_STATUS"] = "44"
        for value in ("", "invalid", token({"exp": NOW}), token({"exp": NOW - 1})):
            with self.subTest(value=value):
                self.env["OP_TOKEN"] = value
                self.log.unlink(missing_ok=True)
                result = self.run_launcher()
                self.assertNotEqual(result.returncode, 0)
                self.assert_fix_steps(result)
                self.assertEqual(self.commands().count("op read "), 1)
                self.assertNotIn("add-generic-password", self.commands())
                self.assert_notified("Splunk token refresh failed. Rotate it if expired.")
                self.assert_no_services()

    def test_fallback_caches_near_expiry_token_without_repeated_reads(self):
        self.env.update(CACHE_READ_STATUS="44", CACHE_USE_WRITTEN="1",
                        OP_TOKEN=token({"exp": NOW + 1}))
        result = self.run_launcher()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("expires within seven days", result.stderr)
        self.assert_fix_steps(result)
        self.assertEqual(self.commands().count("op read "), 1)
        self.assert_started(self.env["OP_TOKEN"], fallback=True)
        self.log.unlink()
        result = self.run_launcher()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("expires within seven days", result.stderr)
        self.assert_fix_steps(result)
        self.assert_started(self.env["OP_TOKEN"])

    def test_fallback_reports_read_and_write_errors_before_services(self):
        self.env["CACHE_READ_STATUS"] = "44"
        for setting, message in (("OP_STATUS", "Could not read"),
                                 ("CACHE_WRITE_STATUS", "Could not cache")):
            with self.subTest(setting=setting):
                self.env[setting] = "42"
                self.log.unlink(missing_ok=True)
                result = self.run_launcher()
                self.assertNotEqual(result.returncode, 0)
                self.assertIn(message, result.stderr)
                self.assert_fix_steps(result)
                self.assertEqual(self.commands().count("op read "), 1)
                self.assert_no_services()
                self.env[setting] = "0"

    def test_fallback_reports_missing_1password_cli(self):
        self.env["CACHE_READ_STATUS"] = "44"
        (self.home / "op").unlink()
        result = self.run_launcher()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("requires the 1Password CLI", result.stderr)
        self.assert_fix_steps(result)
        self.assert_no_services()

    def test_inherited_token_takes_precedence_in_codespaces(self):
        inherited = token({"exp": NOW + WEEK * 2})
        self.env.update(SPLUNK_BEARER_TOKEN=inherited, CODESPACES="true",
                        CACHE_READ_STATUS="44")
        (self.home / "security").unlink()
        (self.home / "op").unlink()
        result = self.run_launcher()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assert_started(inherited)
        self.assertNotIn("security ", self.commands())
        self.assertIn("--dns=100.100.100.100", self.commands())
        self.assertIn("-e SPLUNK_HOST", self.commands())

    def test_invalid_inherited_token_does_not_fall_back(self):
        for value in ("invalid", token({"exp": NOW}), token({})):
            with self.subTest(value=value):
                self.env["SPLUNK_BEARER_TOKEN"] = value
                result = self.run_launcher()
                self.assertNotEqual(result.returncode, 0)
                self.assertNotIn("security ", self.commands())
                self.assertNotIn("op ", self.commands())
                self.assert_no_services()

    def test_placeholder_uses_cache(self):
        self.env["SPLUNK_BEARER_TOKEN"] = "${SPLUNK_BEARER_TOKEN}"
        result = self.run_launcher()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assert_started(self.cached)

    def test_no_keychain_or_inherited_token_stops(self):
        (self.home / "security").unlink()
        result = self.run_launcher()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("SPLUNK_BEARER_TOKEN", result.stderr)
        self.assertNotIn("op ", self.commands())
        self.assert_no_services()

    def test_normal_start_requires_validator_without_reading_credentials(self):
        (self.home / "python3").unlink()
        result = self.run_launcher()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("requires python3", result.stderr)
        self.assertEqual(self.commands(), "")

    def test_explicit_refresh_replaces_cache_and_exits(self):
        refreshed = token({"exp": NOW + WEEK * 3})
        self.env.update(OP_TOKEN=refreshed, SPLUNK_BEARER_TOKEN="invalid",
                        CACHE_TOKEN=token({"exp": NOW - 1}))
        result = self.run_launcher("--refresh-token")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("op read op://Employee/Splunk token/password", self.commands())
        self.assertIn("add-generic-password -U -s splunk-mcp-token -a fake-user -w\n",
                      self.commands())
        self.assertNotIn("find-generic-password", self.commands())
        self.assertEqual((self.home / "cache-input").read_text(),
                         f"{refreshed}\n{refreshed}\n")
        self.assert_no_services()

    def test_refresh_accepts_near_expiry_with_warning(self):
        self.env["OP_TOKEN"] = token({"exp": NOW + 1})
        result = self.run_launcher("--refresh-token")
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIn("expires within seven days", result.stderr)
        self.assertEqual(self.notifications(), [])
        self.assert_no_services()

    def test_refresh_rejects_invalid_token_without_cache_write(self):
        for value in ("invalid", token({"exp": NOW}), token({"exp": NOW - 1})):
            with self.subTest(value=value):
                self.env["OP_TOKEN"] = value
                result = self.run_launcher("--refresh-token")
                self.assertNotEqual(result.returncode, 0)
                self.assertIn("--refresh-token", result.stderr)
                self.assertNotIn("add-generic-password", self.commands())
                self.assertFalse((self.home / "cache-input").exists())
                self.assert_no_services()

    def test_refresh_reports_1password_failure(self):
        self.env["OP_STATUS"] = "42"
        result = self.run_launcher("--refresh-token")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Could not read", result.stderr)
        self.assertNotIn("add-generic-password", self.commands())
        self.assert_no_services()

    def test_refresh_reports_cache_write_failure(self):
        self.env["CACHE_WRITE_STATUS"] = "44"
        result = self.run_launcher("--refresh-token")
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("Could not cache", result.stderr)
        self.assertNotIn("token refreshed", result.stderr)
        self.assert_no_services()

    def test_refresh_checks_dependencies_before_reading_1password(self):
        for name in ("op", "security", "python3"):
            with self.subTest(tool=name):
                tool = self.home / name
                saved = tool.read_text()
                tool.unlink()
                try:
                    result = self.run_launcher("--refresh-token")
                    self.assertNotEqual(result.returncode, 0)
                    self.assertIn("requires", result.stderr)
                    self.assertNotIn("op ", self.commands())
                    self.assert_no_services()
                finally:
                    self.write_tool(name, saved.removeprefix("#!/bin/sh\n"))

    def test_invalid_arguments_stop_before_credentials(self):
        for args in (("--unknown",), ("--refresh-token", "extra"), ("",)):
            with self.subTest(args=args):
                result = self.run_launcher(*args)
                self.assertEqual(result.returncode, 2)
                self.assertIn("Usage:", result.stderr)
                self.assertEqual(self.commands(), "")


if __name__ == "__main__":
    unittest.main()
