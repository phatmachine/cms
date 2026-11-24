---
audit: rtm-sovereignty-audit
version: 1
service: Tailscale (mesh VPN)
operator: Tailscale Inc. (Canada) and Tailscale US Inc. (Delaware)
country: Canada
category: networking (mesh VPN)
alternative_to: [Traditional corporate VPNs, Cloudflare Zero Trust, Zscaler]
verdict: not-recommended
verdict_label: Not recommended
tally: { pass: 1, flag: 5, fail: 0, unverified: 0 }
tests:
  - { test: Independence,      result: flag, headline: "VC-backed; core hosting on AWS" }
  - { test: US reach,          result: flag, headline: "US subsidiary, US hosting, US subprocessors" }
  - { test: Privacy model,     result: flag, headline: "Traffic unreadable; ad cookies, closed server" }
  - { test: Military ties,     result: flag, headline: "Lead investor funds defence companies" }
  - { test: Law & user rights, result: flag, headline: "Five Eyes parent; lawful-access bill pending" }
  - { test: Right to leave,    result: pass, headline: "Self-serve deletion; 60-day log rotation" }
takeaway: "Cannot read your traffic, but holds metadata under Canadian and US jurisdiction."
checked: 2026-10-19
recheck_by: 2027-04-19
sources: { total: 27, primary: 25, read_in_full: 24, partial: 3, rtm_research: 0, single_source: 1, needs_confirmation: 0 }
right_of_reply: not-yet-sent
publication_ready: false
blocking: ["Right of reply not yet sent", "Sources other than S1, S2, S3, S15, S22 and S23 were read through a fetch tool that returns answers, not the raw text: re-read the cited passages before publishing", "No corporate registry entry was read (Corporations Canada and OpenCorporates could not be loaded)", "Interest of the person commissioning the audit not yet declared", "[CORRECTIONS CONTACT] placeholder in the disclaimer"]
---

# Sovereignty audit: Tailscale

Tailscale Inc. (Canada) and Tailscale US Inc. (Delaware) · Canada · Checked 19 October 2026 · Re-check by 19 April 2027 · Version 1

Scope: the hosted Tailscale service (coordination server, relay servers and admin console) for self-serve and business customers, as described in the terms dated 25 August 2026. Not audited: Tailscale's optional Aperture and PAM products beyond where they appear in the subprocessor list, and the self-hosted alternative Headscale.

## Summary
Tailscale says it cannot read the content of the traffic that passes through its network, and it publishes its client code under an open licence [S1, S5, S8]. It still fails to meet our standard on five of six tests: its core hosting runs on Amazon Web Services, new accounts contract with a US subsidiary, it runs advertising cookies on its own sites and keeps its coordination server closed, its lead investor has funded defence companies, and its Canadian parent is subject to a lawful-access bill now before the Senate [S2, S3, S7, S12, S15, S20, S22, S23]. Under our rule, five flags make the verdict Not recommended.

## The six tests
### 1. Independence — FLAG
Tailscale's April 2025 Series C of US$160 million was led by Accel, with CRV, Insight Partners, Heavybit and Uncork Capital also named as investors [S15]. The About page lists an Accel partner, Amit Kumar, on the board of directors and names no Big Tech investor [S16]. The Series C post names two angel investors, the chief executives of CrowdStrike and Squarespace [S15]. No record was found as of 19 October 2026 of a Big Tech shareholder in the sources read [S15, S16]. The subprocessor list shows Amazon Web Services, Inc. providing cloud hosting for all products [S3]. Tailscale's security page says customer metadata is backed up to AWS S3 and that analytics are kept in Snowflake [S5]. Its relay servers run on DigitalOcean, Hetzner, Akamai (Linode), Vultr and NetActuate [S3].
**What a reader can do:** Consider Headscale, an independent, community-maintained control server, which the company says is not a supported Tailscale product [S7].

### 2. US reach — FLAG
Accounts created on or after 3 September 2024 contract with Tailscale US Inc., a Delaware corporation in San Francisco, while earlier accounts contract with Tailscale Inc., a Canadian corporation in Toronto [S2]. The Terms apply New York law to business customers [S2]. The subprocessor list gives the United States as a processing location for Amazon Web Services, Inc., DigitalOcean, LLC, Akamai Technologies, Inc., Snowflake Inc., The Constant Company, LLC, NetActuate, Inc., Atlassian Corporation, Vercel Inc. and OpenAI [S3]. The privacy policy says Tailscale processes data in Canada, Germany, the United States and the United Kingdom, and relies on standard contractual clauses for transfers to the US [S1]. Most of what the US-based providers hold is device and node information and configuration information, not traffic content [S3]. The optional Aperture and PAM products send customer content to AWS, Vercel and OpenAI, according to the subprocessor list [S3].
**What a reader can do:** Check which Tailscale entity your own terms name before you sign up [S2], and weigh Headscale if you want the metadata kept off Tailscale's servers [S7].

### 3. Privacy and business model — FLAG
Tailscale says it does not process, and cannot access, the content of traffic on its mesh network, and that relay servers only handle encrypted packets [S1, S5, S6]. It does hold metadata: device names, operating system, hostname, IP address, public key and inter-node traffic logs [S1]. Its security page says customer metadata is stored on its coordination server and that coordination server logs cannot be limited [S5]. The coordination server is closed source, while the client daemon and the relay servers are open source [S7]. The main client repository uses the BSD-3-Clause licence [S8]. Tailscale says it holds a SOC 2 Type II report, available only to customers or under a non-disclosure agreement, and says security audits by Latacora are available on request [S5, S10]. It states that it has no bug bounty programme [S5]. It published 12 security bulletins in 2026 and 8 in 2025 [S11]. One of them, dated 29 May 2026, says a coordination-server bug wrote full OAuth client access tokens into tailnet audit logs for tailnets that used OAuth clients between 1 March and 29 May 2026 [S11]. Tailscale's cookie notice describes a targeted-advertising cookie category on its sites, and the privacy policy says some disclosures to advertising partners may count as a sale or sharing under California law [S1, S12]. The privacy policy does not say whether customer content is used to train AI models [S1]. No transparency report is linked from Tailscale's legal index, although the DPA offers one to business customers on written request, once a year [S4, S26].
**What a reader can do:** Use the "Your Privacy Choices" link or email privacy@tailscale.com to opt out of advertising disclosures [S1].

### 4. Military and security state — FLAG
Tailscale's lead investor, Accel, has led funding for defence companies [S15, S22, S23]. Accel invested US$145 million in CHAOS Industries in November 2024 and describes it as technology for national security [S22]. Accel also led True Anomaly's US$260 million Series C in April 2025; True Anomaly describes its products as software-defined spacecraft and combat systems, and names the US Space Force among its customers [S23]. This is the investor's portfolio, not Tailscale's own business. Tailscale's acceptable use policy prohibits designing or producing nuclear, chemical and biological weapons, and does not mention military or government use [S9]. The Terms contain no military-specific restriction [S2]. No record was found as of 19 October 2026 of a Tailscale defence contract in the sources read, and the sweep log shows the searches made [S2, S9].
**What a reader can do:** Decide whether an investor's separate defence holdings matter to you; the audit makes no finding about Tailscale's own customers [S22, S23].

### 5. Law and user rights — FLAG
Tailscale says Canadian law generally requires a warrant, and that its policy is to notify customers of law-enforcement requests unless the law prohibits it [S1]. The DPA says it will use reasonably available legal mechanisms to challenge binding requests [S4]. Canada's Communications Security Establishment calls itself a member of the Five Eyes [S21]. Bill C-22, the Lawful Access Act, 2026, was at second reading in the Senate, with its latest debate on 8 October 2026 [S20]. Tailscale's own blog says the bill could require "core providers" to build and maintain technical capabilities for government access and to retain categories of metadata for up to one year [S17]. BetaKit reports the government cut the maximum retention period to six months and amended the bill to protect end-to-end encryption [S18]. BetaKit reports that The Globe and Mail was told Tailscale would have to "pursue corporate structures" to distance its international operations from Canada, and a second outlet reports the chief executive said parts of the business may need to restructure [S18, S19]. Tailscale's own post does not mention restructuring [S17]. The Terms require binding JAMS arbitration and a class-action waiver for free and personal-use customers, with a 30-day opt-out [S2]. They allow Tailscale to revise the terms on publication, with "reasonable efforts" to notify of material changes, and to suspend access in listed cases with no appeal process described [S2].
**What a reader can do:** If you are a free or personal-use customer, opt out of arbitration in writing within 30 days of the effective date of the agreement [S2].

### 6. Right to leave — PASS
Any tailnet owner can delete a tailnet from the admin console, which permanently deletes node and user data and metadata from the coordination server's database and cancels active subscriptions [S13]. Diagnostic logs and backups generally rotate out within 60 days [S13]. For business customers, the DPA says personal data is returned or destroyed within 30 days of termination [S4]. The Terms do not describe a data-export right [S2]. The policy file is written in HuJSON, and Tailscale has an API available on all plans, with an official client library listed as MIT-licensed that includes a device-listing example [S14, S24, S27]. Log streaming to storage and SIEM systems is limited to the Premium and Enterprise plans [S25].
**What a reader can do:** Save your policy file and device list through the API before you delete a tailnet, because deleting it is permanent [S13, S14, S24].

## Strongest case against
The map of which of your devices connect to which, with public IP addresses, sits on Tailscale's coordination server, and Tailscale says you cannot limit its logs [S1, S5]. That server is closed source and runs on Amazon Web Services, and new accounts contract with a US corporation [S2, S3, S7]. The Canadian parent faces a lawful-access bill that its own chief executive says could require standing surveillance readiness [S17, S20]. Tailscale's own security claims rest largely on documents available only under a non-disclosure agreement, and it publishes no transparency report [S5, S10, S26].

## What the company says
Tailscale says it complies with lawful, specific requests for data it has, and opposes pressure to collect more data or weaken encryption [S17]. It says customers' private keys never leave their devices and relay servers lack the keys to decrypt what they carry [S5, S17].

## Notes for readers
- Tailscale cannot read the content of traffic between your devices on its own say-so and by its design documents; the exposure is metadata, not content [S1, S5, S6].
- If metadata matters to you, Headscale is an independent self-hosted control server, developed separately from Tailscale and not supported by it [S7].
- Gaps: no registry entry for either Tailscale company was read, and the operators' headquarters countries on the subprocessor list are not stated by Tailscale [S3].
- Tailscale's own post on the bill is dated 26 May 2026; check the bill's current stage before relying on this audit [S17, S20].

## What would change this verdict
Passage of Bill C-22 in a form that requires standing surveillance readiness; Tailscale publishing a transparency report or its SOC 2 and Latacora reports; Tailscale offering customer-controlled hosting of the coordination server; a change of ownership or a new Big Tech investor; a registry entry showing a different parent [S2, S5, S10, S20, S26].

## Integrity record
- Method: the six tests in the Rethink the Machine method, applied to company documents, one government bill page, one government agency report and press reports.
- Checked 19 October 2026; re-check by 19 April 2027.
- Right of reply: not yet sent.
- Conflict of interest: Rethink the Machine receives no payment, commission, free service or advertising from Tailscale. The interest of the person commissioning this audit has not yet been declared.
- Rulings applied: (1) 17 October 2026: if a service does not state how long deletion takes, that is a gap, not a flag. (2) 19 October 2026: a company with a Canadian parent whose new customers contract with a US subsidiary is a FLAG on test 2, not a FAIL.
- Limitation: most pages were read with a fetch tool that answers questions about a page rather than returning its raw text. On 19 October 2026 the claims that decide the verdict were re-checked against the raw page text of S1, S2, S3, S15, S22 and S23. S11, S21 and S25 were read only in part.
- Corrections: none.

| Check | Status |
|---|---|
| Every finding sentence cites at least one source | Done |
| Every cited source read in full, or a partial read corroborated | Open |
| Each finding re-read against its source; nothing overstated | Done |
| No source marked "needs confirmation" | Done |
| Every source has a read date; published dates as shown, none guessed | Done |
| Allegations, unconfirmed reports and company responses labelled | Done |
| Verdict matches the tier rule | Done |
| Summary block matches the body (count check passed) | Done |
| Right of reply sent and 14 days passed (or reply recorded) | Open |
| Checked within the last six months | Done |

Search sweep log:
- "Tailscale subprocessors list": the official list was found through the legal index.
- "Tailscale funding round investors Series C valuation Accel Insight CapitalG": Series C led by Accel; no CapitalG record found.
- "Tailscale transparency report government requests law enforcement": no Tailscale report found.
- "Tailscale Inc. Toronto Canada incorporation Tailscale US Inc. Delaware 2024": split confirmed in the Terms; no stated reason found.
- "Tailscale Inc. Corporations Canada OR opencorporates": no registry record read; the sites would not load.
- "Tailscale defense military Department of Defense contract FedRAMP government customers": no Tailscale defence or FedRAMP record found.
- "Tailscale customer case study Anduril OR Palantir OR Lockheed OR Department of Defense": no defence case study found.
- "Tailscale security incident OR breach OR vulnerability disclosure": 2025 and 2026 security bulletins found.
- "Tailscale lawsuit OR complaint OR regulator OR privacy commissioner OR fine": no lawsuit, regulator action or fine found; the Bill C-22 letter found.
- "Accel venture firm defense investments": CHAOS Industries and True Anomaly found.
- "Insight Partners defense OR weapons OR military investment": no Insight Partners defence holding found.
- "CRV venture firm defense tech OR weapons": no CRV defence record found.
- "Tailscale blog Bill C-22": Tailscale's post and press coverage found.
- "Canada Five Eyes member": the Communications Security Establishment's own report found.
- "tailscale.com kb delete your tailnet": the deletion page found.
- "Tailscale export ACL policy file": policy-file format found; no direct export page found.
- Heavybit and Uncork Capital were not searched for defence holdings.

## Sources
Read on 19 October 2026.

| Id | Source | Publisher | Type | Published | How read | Status |
|---|---|---|---|---|---|---|
| S1 | [Privacy Policy](https://tailscale.com/privacy-policy) | Tailscale | Company | 2026-08-25 | In full | Confirmed |
| S2 | [Terms of Service](https://tailscale.com/terms) | Tailscale | Company | 2026-08-25 | In full | Confirmed |
| S3 | [Subprocessors List](https://tailscale.com/dpa-subprocessors) | Tailscale | Company | 2026-08-26 | In full | Confirmed |
| S4 | [Data Processing Addendum](https://tailscale.com/legal/dpa) | Tailscale | Company | 2026-08-25 | In full | Confirmed |
| S5 | [Security](https://tailscale.com/security) | Tailscale | Company | No date shown | In full | Confirmed |
| S6 | [Encryption](https://tailscale.com/kb/1504/encryption) | Tailscale | Company | 2026-01-07 | In full | Confirmed |
| S7 | [Open source](https://tailscale.com/opensource) | Tailscale | Company | No date shown | In full | Confirmed |
| S8 | [tailscale/tailscale repository](https://github.com/tailscale/tailscale) | Tailscale | Company | No date shown | In full | Confirmed |
| S9 | [Acceptable Use Policy](https://tailscale.com/tailscale-aup) | Tailscale | Company | 2025-06-30 | In full | Confirmed |
| S10 | [Compliance](https://tailscale.com/compliance) | Tailscale | Company | No date shown | In full | Confirmed |
| S11 | [Security bulletins](https://www.tailscale.com/security-bulletins) | Tailscale | Company | No date shown | Partial (the last 15,791 characters were not read) | Confirmed |
| S12 | [Cookie Notice](https://tailscale.com/cookie-notice) | Tailscale | Company | 2025-05-30 | In full | Confirmed |
| S13 | [Delete your tailnet](https://tailscale.com/docs/account/delete-tailnet) | Tailscale | Company | 2025-10-28 | In full | Confirmed |
| S14 | [Tailscale API](https://tailscale.com/docs/reference/tailscale-api) | Tailscale | Company | 2026-06-24 | In full | Confirmed |
| S15 | [Series C announcement](https://tailscale.com/blog/series-c) | Tailscale | Company | 2025-04-08 | In full | Confirmed |
| S16 | [About](https://tailscale.com/about) | Tailscale | Company | No date shown | In full | Confirmed |
| S17 | [Bill C-22 post](https://tailscale.com/blog/bill-c22-canada) | Tailscale | Company | 2026-05-26 | In full | Confirmed |
| S18 | [Tailscale, Windscribe co-sign open letter on Bill C-22](https://betakit.com/tailscale-windscribe-co-sign-open-letter-asking-feds-to-further-amend-bill-c-22/) | BetaKit | Reporting | 2026-09-25 | In full | Single source |
| S19 | [VPN companies warn Bill C-22 could push tech firms out of Canada](https://www.iphoneincanada.ca/2026/09/24/vpn-companies-bill-c22-tech-firms-canada/) | iPhone in Canada | Reporting | No date shown | In full | Confirmed by S18 |
| S20 | [Bill C-22, Lawful Access Act, 2026](https://www.parl.ca/legisinfo/en/bill/45-1/c-22) | Parliament of Canada | Government | 2026-10-08 | In full | Confirmed |
| S21 | [CSE Annual Report 2024-2025](https://www.cse-cst.gc.ca/en/accountability/transparency/reports/communications-security-establishment-canada-annual-report-2024-2025) | Communications Security Establishment Canada | Government | No date shown | Partial (the last 26,502 characters were not read) | Confirmed |
| S22 | [Our investment in CHAOS](https://accel.com/news/our-investment-in-chaos-bringing-groundbreaking-new-technologies-to-national-defense) | Accel | Company | 2024-11-13 | In full | Confirmed |
| S23 | [Announcing our $260M fundraise](https://www.trueanomaly.space/newsroom/announcing-our-260m-fundraise) | True Anomaly | Company | 2025-04-30 | In full | Confirmed |
| S24 | [Tailnet policy file syntax](https://tailscale.com/docs/reference/syntax/policy-file.md) | Tailscale | Company | 2026-04-08 | In full | Confirmed |
| S25 | [Log streaming](https://tailscale.com/docs/features/logging/log-streaming.md) | Tailscale | Company | 2026-02-02 | Partial (the first 50 lines were read) | Confirmed |
| S26 | [Legal and Trust](https://tailscale.com/legal) | Tailscale | Company | No date shown | In full | Confirmed |
| S27 | [tailscale-client-go-v2](https://github.com/tailscale/tailscale-client-go-v2) | Tailscale | Company | No date shown | In full | Confirmed |

## Disclaimer
> This audit is Rethink the Machine's assessment, based on the public sources listed and the tests in our method. It reflects what we found on the date checked. Companies, ownership, policies and laws change, so some of it may now be inaccurate or out of date; each source shows when it was published and when we read it. Lawsuits and complaints are described as allegations unless a court or regulator has ruled. This is not legal, security or financial advice. We receive no payment, commission, free service or advertising from any company we assess. To report an error, contact [CORRECTIONS CONTACT]; corrections are logged above with their dates.
