import hashlib
import json
import os
from pathlib import Path
import subprocess
import tempfile
import unittest


SCRIPT = Path(__file__).resolve().parents[1] / "script/apply-vscode-settings"
BACKGROUNDS = (
    "titleBar.activeBackground",
    "titleBar.inactiveBackground",
    "statusBar.background",
    "activityBar.background",
)
PALETTE = (
    "#235093", "#6b327c", "#17655f", "#7a3e24",
    "#704c12", "#7a3045", "#3f527d", "#4b5e28",
)


class ApplyVSCodeSettingsTest(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.addCleanup(self.directory.cleanup)
        self.home = Path(self.directory.name)
        self.env = {
            **os.environ,
            "HOME": str(self.home),
            "CODESPACES": "true",
            "CODESPACE_NAME": "test-codespace",
        }

    def run_script(self):
        return subprocess.run(
            ["bash", str(SCRIPT)], env=self.env, capture_output=True, text=True
        )

    def settings_path(self, root=".vscode-remote"):
        return self.home / root / "data/Machine/settings.json"

    def test_outside_codespaces_is_noop(self):
        for value in ("false", ""):
            with self.subTest(value=value):
                self.env["CODESPACES"] = value
                self.env.pop("CODESPACE_NAME", None)
                self.assertEqual(self.run_script().returncode, 0)
                self.assertEqual(list(self.home.iterdir()), [])

    def test_missing_name_fails_without_writing(self):
        del self.env["CODESPACE_NAME"]
        result = self.run_script()
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("CODESPACE_NAME", result.stderr)
        self.assertEqual(list(self.home.iterdir()), [])

    def test_creates_stable_colors_for_different_names(self):
        observed = set()
        for name in ("test-codespace", "another-codespace", "third-codespace"):
            with self.subTest(name=name):
                self.env["CODESPACE_NAME"] = name
                result = self.run_script()
                self.assertEqual(result.returncode, 0, result.stderr)
                path = self.settings_path()
                original = path.read_bytes()
                settings = json.loads(original)
                digest = hashlib.sha256(name.encode()).hexdigest()
                expected = PALETTE[int(digest, 16) % len(PALETTE)]
                observed.add(expected)
                colors = settings["workbench.colorCustomizations"]
                for key in BACKGROUNDS:
                    self.assertEqual(colors[key], expected)
                self.assertEqual(colors["titleBar.activeForeground"], "#ffffff")
                self.assertEqual(
                    settings["workbench.externalUriOpeners"]["https://github.com/**"],
                    "default",
                )
                self.assertEqual(self.run_script().returncode, 0)
                self.assertEqual(path.read_bytes(), original)
        self.assertGreater(len(observed), 1)

    def test_merges_both_roots_preserving_unrelated_settings(self):
        for root in (".vscode-remote", ".vscode-server"):
            path = self.settings_path(root)
            path.parent.mkdir(parents=True)
            path.write_text(json.dumps({
                "editor.fontSize": 16,
                "workbench.colorCustomizations": {
                    "editor.background": "#123456",
                    "statusBar.background": "#000000",
                    "[Some Theme]": {"editor.foreground": "#abcdef"},
                },
                "workbench.externalUriOpeners": {
                    "https://example.com/**": "custom",
                    "https://github.com/**": "extension",
                },
            }))
        result = self.run_script()
        self.assertEqual(result.returncode, 0, result.stderr)
        for root in (".vscode-remote", ".vscode-server"):
            settings = json.loads(self.settings_path(root).read_text())
            self.assertEqual(settings["editor.fontSize"], 16)
            colors = settings["workbench.colorCustomizations"]
            self.assertEqual(colors["editor.background"], "#123456")
            self.assertEqual(
                colors["[Some Theme]"], {"editor.foreground": "#abcdef"}
            )
            self.assertIn(colors["statusBar.background"], PALETTE)
            self.assertEqual(settings["workbench.externalUriOpeners"], {
                "https://example.com/**": "custom",
                "https://github.com/**": "default",
            })

    def test_server_only_does_not_create_remote_root(self):
        (self.home / ".vscode-server").mkdir()
        result = self.run_script()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertTrue(self.settings_path(".vscode-server").is_file())
        self.assertFalse((self.home / ".vscode-remote").exists())

    def test_empty_settings_file(self):
        path = self.settings_path()
        path.parent.mkdir(parents=True)
        path.touch()
        result = self.run_script()
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertIsInstance(json.loads(path.read_text()), dict)

    def test_invalid_settings_are_left_untouched(self):
        path = self.settings_path()
        path.parent.mkdir(parents=True)
        for content in ('{"broken":', '{"a": 1,}', '// comment\n{}', "[]", "null"):
            with self.subTest(content=content):
                path.write_text(content)
                result = self.run_script()
                self.assertNotEqual(result.returncode, 0)
                self.assertIn(str(path), result.stderr)
                self.assertEqual(path.read_text(), content)
                self.assertEqual(list(path.parent.iterdir()), [path])


if __name__ == "__main__":
    unittest.main()
