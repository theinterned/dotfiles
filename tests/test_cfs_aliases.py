import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]


class CFSAliasesTest(unittest.TestCase):
    def test_shortcuts(self):
        for name in ("bash", "zsh", "fish"):
            shell = shutil.which(name)
            if not shell:
                continue
            with self.subTest(shell=name), tempfile.TemporaryDirectory() as directory:
                home = Path(directory)
                source = ROOT / (
                    ".config/fish/aliases.fish" if name == "fish" else ".aliases"
                )
                flags = {
                    "bash": ["--noprofile", "--norc"],
                    "zsh": ["-f"],
                    "fish": ["--no-config"],
                }[name]
                prefix = "shopt -s expand_aliases; " if name == "bash" else ""
                env = {**os.environ, "HOME": directory, "PATH": directory}

                def run(command):
                    return subprocess.run(
                        [shell, *flags, "-c",
                         f'{prefix}source "{source}"; {command}'],
                        env=env, text=True, capture_output=True,
                    )

                npx = 'eval \'npx --package=example@1.0.0 -- tool "two words"\''
                result = run(npx)
                self.assertEqual(result.returncode, 127)
                self.assertIn("GitHub CLI", result.stderr)

                gh = home / "gh"
                gh.write_text("#!/bin/sh\nexit 1\n")
                gh.chmod(0o755)
                result = run(npx)
                self.assertEqual(result.returncode, 127)
                self.assertIn("gh extension install github/gh-cfs", result.stderr)

                gh.write_text(
                    '#!/bin/sh\n'
                    'if [ "$1 $2" = "cfs version" ]; then exit 0; fi\n'
                    'printf "<%s>\\n" "$@"\n'
                    'exit 23\n'
                )
                cases = [
                    (npx, ["npx", "--package=example@1.0.0", "--", "tool", "two words"]),
                ]
                for shortcut, action in (("ni", "install"), ("nci", "ci")):
                    if name == "fish":
                        result = run(f"abbr --show {shortcut}")
                        self.assertEqual(result.returncode, 0, result.stderr)
                        self.assertIn(f"cfs-npm {action}", result.stdout)
                        command = f'cfs-npm {action} "two words"'
                    else:
                        command = f'eval \'{shortcut} "two words"\''
                    cases.append((command, ["npm", action, "two words"]))

                for command, args in cases:
                    result = run(command)
                    self.assertEqual(result.returncode, 23, result.stderr)
                    self.assertEqual(
                        result.stdout.splitlines(),
                        [f"<{arg}>" for arg in ["cfs", "--", *args]],
                    )


if __name__ == "__main__":
    unittest.main()
