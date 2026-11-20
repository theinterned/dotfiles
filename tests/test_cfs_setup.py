import os
from pathlib import Path
import subprocess
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "script/setup-cfs"


class CFSSetupTest(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.home = Path(self.directory.name)
        self.log = self.home / "commands"
        self.env = {
            **os.environ,
            "HOME": str(self.home),
            "PATH": str(self.home),
            "COMMAND_LOG": str(self.log),
            "CFS_INSTALLED": "1",
            "INSTALL_FAIL": "0",
        }
        self.write_tool("az", 'echo "Unexpected Azure invocation" >&2\nexit 99\n')
        self.write_tool("cat", '/bin/cat "$@"\n')
        self.write_tool("gh", """
printf '%s\\n' "$*" >> "$COMMAND_LOG"
case "$*" in
  "cfs version")
    if [ "$CFS_INSTALLED" = 1 ] || [ -f "$HOME/installed" ]; then
      echo "gh-cfs test"
    else
      exit 1
    fi
    ;;
  "extension install github/gh-cfs")
    if [ "$INSTALL_FAIL" = 1 ]; then
      echo "Repository access denied" >&2
      exit 42
    fi
    : > "$HOME/installed"
    ;;
  *) echo "Unexpected command: $*" >&2; exit 99 ;;
esac
""")

    def write_tool(self, name, body):
        path = self.home / name
        path.write_text("#!/bin/sh\n" + body)
        path.chmod(0o755)

    def run_setup(self):
        return subprocess.run(
            ["/bin/bash", str(SCRIPT)],
            env=self.env, capture_output=True, text=True,
        )

    def test_existing_extension_does_not_reinstall_or_authenticate(self):
        result = self.run_setup()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(self.log.read_text().splitlines(), [
            "cfs version", "cfs version",
        ])
        self.assertIn("--use-device-code", result.stdout)
        self.assertIn("@githubazure.com", result.stdout)

    def test_install_is_repeatable(self):
        self.env["CFS_INSTALLED"] = "0"
        for _ in range(2):
            result = self.run_setup()
            self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(
            self.log.read_text().splitlines().count(
                "extension install github/gh-cfs"
            ), 1,
        )

    def test_install_error_is_preserved(self):
        self.env.update(CFS_INSTALLED="0", INSTALL_FAIL="1")
        result = self.run_setup()
        self.assertEqual(result.returncode, 42)
        self.assertIn("Repository access denied", result.stderr)
        self.assertNotIn("CFS is installed.", result.stdout)

    def test_missing_dependencies_stop_setup(self):
        for name in ("gh", "az"):
            with self.subTest(tool=name):
                tool = self.home / name
                saved = tool.read_text()
                tool.unlink()
                try:
                    result = self.run_setup()
                    self.assertEqual(result.returncode, 127)
                    self.assertIn(f"requires {name}", result.stderr)
                finally:
                    self.write_tool(name, saved.removeprefix("#!/bin/sh\n"))


if __name__ == "__main__":
    unittest.main()
