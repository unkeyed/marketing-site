# Licensing

This repository uses a three-layer license split. Different parts of the
repository carry different terms. Before you use, copy, or fork any part of
this project, read this document and confirm which terms apply to the
material you intend to use.

## Summary

| Layer         | Covers                                           | License                                    | File             |
|---------------|--------------------------------------------------|--------------------------------------------|------------------|
| Source code   | TypeScript, CSS, config, build scripts           | GNU Affero General Public License v3.0     | `LICENSE`        |
| Content       | MDX, blog posts, case studies, marketing copy, non-brand imagery | CC BY-NC-ND 4.0 plus supplemental terms    | `LICENSE-CONTENT`|
| Trademarks    | The Unkey name, logos, wordmark, brand assets    | All rights reserved, limited nominative use | `TRADEMARKS.md`  |

## Source code (AGPL-3.0)

The software code in this repository, including everything under `src/` (with
the exception of files under `src/content/`), configuration files at the
repository root, build tooling, and any other code not explicitly excluded,
is licensed under the GNU Affero General Public License v3.0. See `LICENSE`
for the full text.

The practical implication of AGPL-3.0 for a web application is that if you
modify the code and operate the modified version as a network service
accessible to third parties, you must make the complete corresponding source
code of your modified version available to those users under the same
license.

## Content (CC BY-NC-ND 4.0 with supplemental terms)

All MDX files under `src/content/`, the marketing copy rendered by the site,
illustrations and non-logo images under `public/` and `src/assets/`, and
customer-facing text authored by Unkey are licensed under Creative Commons
Attribution-NonCommercial-NoDerivatives 4.0 International, with additional
terms set out in `LICENSE-CONTENT`.

You may view and share unmodified copies of the Content for non-commercial
purposes with attribution. You may not create derivative works, republish the
Content commercially, or use the Content to train machine learning models.

## Trademarks (all rights reserved)

The Unkey name, logo, wordmark, and associated brand assets are trademarks
of Unkeyed, Inc. They are not licensed under AGPL-3.0 or CC BY-NC-ND 4.0.
See `TRADEMARKS.md` for the full policy.

If you fork this repository to build your own project, you must remove or
replace all Unkey branding before publishing, hosting, or distributing the
fork.

## Why this structure

The three-layer split reflects three distinct interests:

1. The source code is open under a strong copyleft license. You are welcome
   to study it, learn from it, and contribute improvements back. If you run a
   modified fork as a service, you share your changes with your users.
2. The content represents editorial and marketing work, not reusable
   software. Restricting derivatives and commercial reuse protects against
   clone sites that lift our writing wholesale.
3. The trademarks identify Unkey as a company. Trademark law operates
   independently of copyright, and nothing in the code or content license
   grants permission to use the Unkey name or logo.

## Contributing

Contributions to this repository are accepted under the terms described in
our [contributing guide](https://engineering.unkey.com/contributing). By
opening a pull request, you agree that your contribution to the source code
is licensed under AGPL-3.0, and any contribution to the Content is licensed
under the terms in `LICENSE-CONTENT`.

## Questions

For licensing questions, commercial licensing inquiries, or permission
requests outside the scope of these terms, contact legal@unkey.com.
