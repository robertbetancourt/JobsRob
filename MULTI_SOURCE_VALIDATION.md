# Multi-Source Integration Report

## 1. Data Sources
| Source | Fetched | Normalized |
|--------|---------|------------|
| Greenhouse | 247 | 247 |
| Lever | 99 | 99 |
| Ashby | 223 | 223 |
| **Total** | **569** | **569** |

## 2. Deduplication Results
- **Canonical Opportunities Produced:** 557
- **Unique to One Source:** 543
- **Cross-Source / Repeated Duplicates Grouped:** 14 (Total redundant listings merged: 14)

## 3. Persistence & Integrity
- **User Status Preserved on Upsert:** Yes
- **Discovered_at Preserved on Upsert:** Yes
- **Repeated Ingestion Safety:** Safe (repeatedly ingesting the same 569 jobs resulted in exactly 557 records, not 853.5).

## 4. Examples of Provenance Preservation
- **Staff Software Engineer, Product Engineering - UK (Ashby)**: Found on Ashby (1 sources)\n- **Mid-Market Solutions Consultant, New York (Notion)**: Found on Ashby (1 sources)\n- **Product Support Specialist - APAC (Ashby)**: Found on Ashby (1 sources)

## Conclusion
The multi-source pipeline successfully consolidates raw feeds from Greenhouse, Lever, and Ashby into a deduplicated, canonical IndexedDB dataset without losing external URLs or overwriting user interactions.
