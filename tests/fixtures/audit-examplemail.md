---
audit: rtm-sovereignty-audit
version: 1
service: ExampleMail (encrypted email)
operator: ExampleMail AG
country: Switzerland
category: email
alternative_to: [Gmail, Outlook]
verdict: recommend-with-caveats
verdict_label: Recommend with caveats
tally: { pass: 4, flag: 2, fail: 0, unverified: 0 }
tests:
  - { test: Independence,      result: pass, headline: "Owned by founders and employees" }
  - { test: US reach,          result: flag, headline: "US card processor handles payments" }
  - { test: Privacy model,     result: pass, headline: "Paid; content zero-access encrypted" }
  - { test: Military ties,     result: pass, headline: "No record of defence customers" }
  - { test: Law & user rights, result: pass, headline: "Swiss law; right to sue preserved" }
  - { test: Right to leave,    result: flag, headline: "Export only in proprietary format" }
takeaway: "Strong encryption, but the closed-source apps are unaudited."
checked: 2026-10-17
recheck_by: 2027-04-17
sources: { total: 5, primary: 4, read_in_full: 5, partial: 0, rtm_research: 0, single_source: 1, needs_confirmation: 0 }
right_of_reply: replied
publication_ready: true
blocking: []
---

# Sovereignty audit: ExampleMail

ExampleMail AG · Switzerland · Checked 17 October 2026 · Re-check by 17 April 2027 · Version 1

Scope: the consumer email product, not the business tier.

## Summary
ExampleMail AG is owned by its founders and employees, and no Big Tech investor appears on the register [S1]. A US card processor appears in its subprocessor list, touching payments only [S2]. Its export format is proprietary [S4].

## The six tests
### 1. Independence — PASS
The register shows the founders and employees as owners, with no Big Tech shareholder [S1].

### 2. US reach — FLAG
No US entity appears in the ownership chain [S1]. A US card processor appears in the subprocessor list, touching payments only [S2].
**What a reader can do:** Pay by bank transfer where offered to keep the card processor out of the picture.

### 3. Privacy and business model — PASS
Revenue is from paid subscriptions, with no advertising [S3]. Content is zero-access encrypted [S3].

### 4. Military and security state — PASS
No record found as of 17 October 2026 of defence or intelligence customers in the sources read [S1, S2, S3].

### 5. Law and user rights — PASS
Swiss data-protection law applies, and the terms preserve the right to go to court [S4].

### 6. Right to leave — FLAG
Export is available only as a proprietary archive [S4]. Account deletion is real and takes 30 days [S3].
**What a reader can do:** Export your mail to an open format with a mail client before closing the account.

## Strongest case against
The closed-source apps have not been independently audited since 2024, so the encryption claim rests on the company's own documentation [S5].

## What the company says
ExampleMail says its content is encrypted so that it cannot read it [S3].

## Notes for readers
- Use a mail client that exports to an open format before you cancel [S4].
- Keep your own backup; deletion takes 30 days [S3].

## What would change this verdict
An acquisition by a Big Tech group; a move of hosting to a US cloud; a published independent audit finding flaws [S5].

## Integrity record
- Method: the six tests in the Rethink the Machine method.
- Checked 17 October 2026; re-check by 17 April 2027.
- Right of reply: replied on 3 October 2026.
- Conflict of interest: none.
- Corrections: none.

| Check | Status |
|---|---|
| Every finding sentence cites at least one source | Done |
| Verdict matches the tier rule | Done |

## Sources
Read on 17 October 2026.

| Id | Source | Publisher | Type | Published | How read | Status |
|---|---|---|---|---|---|---|
| S1 | [Commercial register entry](https://example.com/zefix/examplemail) | Zefix | Registry | No date shown | In full | Confirmed |
| S2 | [Subprocessor list](https://example.com/legal/subprocessors) | ExampleMail AG | Company | 2026-08-02 | In full | Confirmed |
| S3 | [Privacy policy](https://example.com/privacy) | ExampleMail AG | Company | 2026-06-10 | In full | Confirmed |
| S4 | [Terms of service](https://example.com/terms) | ExampleMail AG | Company | 2026-06-10 | In full | Confirmed |
| S5 | [Independent security review](https://example.com/news/review) | Example News | Technical analysis | 2024-11-05 | In full | Single source |

## Disclaimer
> This audit is Rethink the Machine's assessment, based on the public sources listed and the tests in our method. It reflects what we found on the date checked. Companies, ownership, policies and laws change, so some of it may now be inaccurate or out of date; each source shows when it was published and when we read it. Lawsuits and complaints are described as allegations unless a court or regulator has ruled. This is not legal, security or financial advice. We receive no payment, commission, free service or advertising from any company we assess. To report an error, contact corrections@example.com; corrections are logged above with their dates.
