# Gate evidence

All gate files begin NOT_RUN. Actual PASS records require executed checks, named review, current commit, hashed artifacts, matching input hashes, and no blockers. Missing credentials or participants are not PASS.

Only sanitized evidence goes in this folder. Raw sensitive material belongs in ignored/private controlled storage. The bootstrap verifier is a baseline integrity check; G0 will extend phase-specific schemas and acceptance checks before recording PASS.
