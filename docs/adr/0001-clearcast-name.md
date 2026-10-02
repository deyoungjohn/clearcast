# ADR 0001: Clearcast product name

Status: Accepted by the owner, 2 October 2026.

The user selected **Clearcast** for the Clerk/Resolve architecture. The copied architecture is preserved unchanged at `docs/architecture.md` so its original requirements remain auditable.

New product text, packages and repository names use Clearcast. Internal packages may use `@clearcast/contracts`, `@clearcast/compiler`, and similar names. Historical references to Clerk/Resolve describe the workflow and compiler roles, not separate products.

Before implementing any signed/hash protocol, write a versioned identifier map from the blueprint's `clerk.*`, `clerk:*` and cookie names to the chosen Clearcast equivalents. There are no deployed Clearcast identifiers or approvals in this bootstrap. Make the mapping explicit in golden test vectors; never blindly rename hashes or treat a renamed schema as byte-compatible with the blueprint.

Retain the exact approved market semantics and gates. Branding does not waive validation or change settlement authority.
