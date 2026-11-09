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
DARK_PALETTE = (
    "#235093", "#6b327c", "#17655f", "#7a3e24",
    "#704c12", "#7a3045", "#3f527d", "#4b5e28",
)
LIGHT_PALETTE = (
    "#dce8f8", "#eedff3", "#d9eeeb", "#f4e3da",
    "#f2e8d5", "#f3dfe5", "#e1e6f1", "#e5ecd9",
)
THEMES = {
    "[GitHub Light Default]": LIGHT_PALETTE,
    "[GitHub Dark Default]": DARK_PALETTE,
}


def contrast_ratio(foreground, background):
    def rgb(color):
        return [int(color[index:index + 2], 16) / 255 for index in (1, 3, 5)]

    def luminance(channels):
        linear = [
            channel / 12.92 if channel <= 0.04045
            else ((channel + 0.055) / 1.055) ** 2.4
            for channel in channels
        ]
        return sum(channel * weight for channel, weight in zip(
            linear, (0.2126, 0.7152, 0.0722)
        ))

    alpha = int(foreground[7:9], 16) / 255 if len(foreground) == 9 else 1
    backdrop = rgb(background)
    blended = [
        channel * alpha + behind * (1 - alpha)
        for channel, behind in zip(rgb(foreground), backdrop)
    ]
    lighter, darker = sorted(
        (luminance(blended), luminance(backdrop)), reverse=True
    )
    return (lighter + 0.05) / (darker + 0.05)


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
                index = int(digest, 16) % len(DARK_PALETTE)
                observed.add(index)
                colors = settings["workbench.colorCustomizations"]
                for theme, palette in THEMES.items():
                    for key in BACKGROUNDS:
                        self.assertEqual(colors[theme][key], palette[index])
                for key in BACKGROUNDS:
                    self.assertNotIn(key, colors)
                self.assertEqual(
                    colors["[GitHub Light Default]"]["activityBar.foreground"],
                    "#24292f",
                )
                self.assertEqual(
                    colors["[GitHub Dark Default]"]["activityBar.foreground"],
                    "#ffffff",
                )
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
            self.assertEqual(colors["statusBar.background"], "#000000")
            for theme, palette in THEMES.items():
                self.assertIn(colors[theme]["statusBar.background"], palette)
            self.assertEqual(settings["workbench.externalUriOpeners"], {
                "https://example.com/**": "custom",
                "https://github.com/**": "default",
            })

    def test_migrates_legacy_colors_preserving_theme_preferences(self):
        for root in (".vscode-remote", ".vscode-server"):
            path = self.settings_path(root)
            path.parent.mkdir(parents=True)
            path.write_text(json.dumps({
                "window.autoDetectColorScheme": True,
                "workbench.preferredLightColorTheme": "GitHub Light Default",
                "workbench.preferredDarkColorTheme": "GitHub Dark Default",
                "workbench.colorCustomizations": {
                    **{key: DARK_PALETTE[4] for key in BACKGROUNDS},
                    "titleBar.activeForeground": "#ffffff",
                    "titleBar.inactiveForeground": "#ffffffcc",
                    "statusBar.foreground": "#ffffff",
                    "[GitHub Light Default]": {
                        "activityBar.background": "#704c12",
                        "editor.background": "#fafafa",
                    },
                },
            }))
        result = self.run_script()
        self.assertEqual(result.returncode, 0, result.stderr)
        originals = {}
        for root in (".vscode-remote", ".vscode-server"):
            path = self.settings_path(root)
            originals[root] = path.read_bytes()
            settings = json.loads(originals[root])
            self.assertTrue(settings["window.autoDetectColorScheme"])
            self.assertEqual(
                settings["workbench.preferredLightColorTheme"], "GitHub Light Default"
            )
            self.assertEqual(
                settings["workbench.preferredDarkColorTheme"], "GitHub Dark Default"
            )
            colors = settings["workbench.colorCustomizations"]
            self.assertEqual(set(colors), set(THEMES))
            self.assertEqual(
                colors["[GitHub Light Default]"]["editor.background"], "#fafafa"
            )
            for theme, palette in THEMES.items():
                for key in BACKGROUNDS:
                    self.assertIn(colors[theme][key], palette)
        self.assertEqual(self.run_script().returncode, 0)
        for root, original in originals.items():
            self.assertEqual(self.settings_path(root).read_bytes(), original)

    def test_every_palette_color_has_readable_active_and_inactive_foregrounds(self):
        names = {}
        for number in range(1000):
            name = f"contrast-codespace-{number}"
            index = int(hashlib.sha256(name.encode()).hexdigest(), 16) % len(DARK_PALETTE)
            names[index] = name
            if len(names) == len(DARK_PALETTE):
                break
        self.assertEqual(len(names), len(DARK_PALETTE))
        pairs = (
            ("titleBar.activeForeground", "titleBar.activeBackground"),
            ("titleBar.inactiveForeground", "titleBar.inactiveBackground"),
            ("statusBar.foreground", "statusBar.background"),
            ("activityBar.foreground", "activityBar.background"),
            ("activityBar.inactiveForeground", "activityBar.background"),
        )
        for index, name in names.items():
            self.env["CODESPACE_NAME"] = name
            result = self.run_script()
            self.assertEqual(result.returncode, 0, result.stderr)
            colors = json.loads(self.settings_path().read_text())[
                "workbench.colorCustomizations"
            ]
            for theme, palette in THEMES.items():
                for foreground, background in pairs:
                    with self.subTest(index=index, theme=theme, foreground=foreground):
                        self.assertEqual(colors[theme][background], palette[index])
                        self.assertGreaterEqual(
                            contrast_ratio(
                                colors[theme][foreground], colors[theme][background]
                            ),
                            4.5,
                        )

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
