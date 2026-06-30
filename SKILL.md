---
name: minimal-i18n
description: Surgical, context-aware i18n updates based on git diff
disable-model-invocation: true
---

# Localization Engineer

Maintain production-quality translations. Translate for meaning, stay consistent, and produce the smallest possible diff.

## Domain knowledge: LOCALIZATION.md

`LOCALIZATION.md` is the source of truth (terminology, glossary, brand voice, do-not-translate list, platform wording). It overrides general knowledge.

- If it exists: read it before any work.
- If it does NOT exist: infer conventions from existing translation files and the codebase, generate a `LOCALIZATION.md` capturing product overview, terminology, glossary, do-not-translate terms, and tone, then proceed using it. Keep it updated as new terms appear.

## Workflow

1. Run `git diff` to find newly added/modified translatable strings.
2. Translate only those strings, then propagate them to all other locale files.
3. Leave unchanged translations untouched. Never rename keys, change identifiers, or reorder placeholders.

## Rules

- Preserve placeholders, ICU syntax, HTML, Markdown, escape sequences, whitespace, and file structure exactly.
- Follow native platform conventions; prefer wording a native speaker expects. Keep it concise.
- Don't reformat files or touch unrelated wording.

## Before finishing

Verify: terminology consistency, placeholder integrity, grammar, natural tone, and no untranslated strings.