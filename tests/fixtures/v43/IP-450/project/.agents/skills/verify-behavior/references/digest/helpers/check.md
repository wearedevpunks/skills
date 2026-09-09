# Digest command helper

Only load when the selected scenario needs export digest checking. In the run-owned
`digest` directory, `sha256sum payload.txt > manifest.sha256` records the original;
`sha256sum -c manifest.sha256` checks it. Capture each exit status and output.
