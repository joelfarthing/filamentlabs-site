# The Wandering Filament: Geometric Evidence for Sequential Printing in the Shakespeare First Folio

## Abstract

We report on a filament defect — likely a hair trapped in the printing forme — that left a curved ink imprint on leaf 2o3v (Hamlet, Act 2) across all examined copies of the Shakespeare First Folio (1623). Semi-automated tracing and geometric analysis of 55 copies from 23 institutions reveals that the filament's position underwent a monotonic, directional drift consistent with progressive deformation during sequential printing. Principal Component Analysis of the resampled shape vectors identifies a dominant "Primary Drift Component" (PC1, 73.3% of variance) that correlates almost perfectly with horizontal displacement ($\rho = 0.984$). Hierarchical clustering detects distinct stability plateaus, the largest comprising 23 copies (42% of the dataset) with low internal geometric variance — evidence for an uninterrupted "long run" of press work. While absolute chronology cannot be reconstructed from this evidence alone, the filament’s progressive distortion offers a novel, localized physical indicator of relative printing sequence within this specific forme (2o3v), independent of and complementary to traditional bibliographic evidence.

---

## 1. Introduction

The printing chronology of the Shakespeare First Folio (London, 1623; STC 22273) has been reconstructed principally through analysis of type damage, compositorial spellings, paper stocks, and press variants (Hinman 1963; Blayney 1991). These approaches operate at the level of formes, quires, or compositors, recovering a coarse ordering of the book's production. Fine-grained evidence for the order of individual impressions within a single forme — i.e., the sequence in which sheets passed through the press on a given day — has remained elusive.

This study concerns a different class of evidence: a recurring physical defect on leaf 2o3v, which carries the running title "Prince of Denmarke" above Hamlet Act 2, Scene 2. Visible in high-resolution digital surrogates as a faint curved line traversing the headline area, this mark appears to be the impression of a hair or fibre trapped between the type and the tympan during printing. Unlike type damage, which accumulates discretely and often ambiguously, a filament embedded in the forme is subject to continuous mechanical forces — the pressure of impression, the action of ink balls, the vibration of the press — that cause it to migrate and deform gradually over the course of a print run.

If the filament’s geometric change is monotonic, then its shape in a given copy may encode information about that copy’s relative position within the printing sequence. In this sense, the filament functions as a potential ordering signal.

We test this hypothesis through geometric morphometrics applied to 55 independently sourced copies of leaf 2o3v, spanning collections in North America, Europe, and Australasia.

## 2. Materials and Methods

### 2.1 Corpus Assembly

Digital images of leaf 2o3v were collected from 23 institutions (Table S1), including the Folger Shakespeare Library (Washington, D.C.), the Bodleian Library (Oxford), the Brotherton Library (Leeds), and the Württembergische Landesbibliothek (Stuttgart), among others. Images were sourced via IIIF manifests, institutional APIs, and direct correspondence, with resolutions ranging from approximately 300 to over 600 pixels per inch. Of 57 images initially collected, two were excluded: FF2O3V-012 (a Norton facsimile with insufficient resolution) and FF2O3V-053 (a partial leaf from the Harry Ransom Center that failed geometric registration). The analysed corpus comprises 55 copies.

### 2.2 Image Normalisation

To isolate filament deformation from global differences in imaging conditions (scale, rotation, tonal response), all images were dynamically registered to a reference standard (Folger Copy 5, FF2O3V-005) using SIFT/ORB feature matching with RANSAC outlier rejection. The registration produced affine transformations mapping each image to a common 1000 × 340 pixel crop of the headline region. Thirteen images that initially produced degenerate warps (due to false-positive feature matches) were corrected by manual anchor-point definition (six corresponding letterforms per image). The quality of registration was validated through composite overlays and a median-subtracted Median Absolute Deviation (MAD) heatmap, which revealed the filament drift signal with high clarity against suppressed invariant text.

### 2.3 Filament Tracing

Three automated centreline extraction methods were tested — median edge subtraction, multi-scale Hessian ridge filtering, and Hessian filtering on median-subtracted crops — and all failed. At 1000 × 340 pixel resolution, the filament mark is approximately 1–2 pixels wide with a grey-level contrast of 5–15 levels against the paper grain, placing it below the single-image noise floor for automated segmentation. The filament signal is recoverable only through statistical aggregation across copies (as in the variance heatmap) or through direct human visual inspection.

Filament centrelines were therefore extracted semi-automatically. An operator traced each filament path using a Wacom pen tablet in a purpose-built browser tool, clicking 5–15 control points along the visible mark. Control points were interpolated with parametric cubic B-splines and resampled to 100 equidistant arc-length-parameterised points. All 55 images were traced in a single session (approximately 15 minutes). The traced data were validated by comparing a composite overlay of all 55 traces against the MAD variance heatmap; trace positions correspond precisely to the high-variance filament region.

### 2.4 Shape Analysis

Each resampled trace was represented as a 200-dimensional vector (100 $x$-$y$ coordinate pairs). A Generalised Procrustes Analysis (GPA) was performed to remove residual translation and rotation differences between traces. The aligned shapes were then analysed through:

1. **Principal Component Analysis (PCA):** Applied to the flattened coordinate matrix ($55 \times 200$) to identify the dominant axes of shape variation. The first principal component (PC1) was tested as a candidate for the "Primary Drift Component" via Spearman rank correlation against geometric summary features.

2. **Hierarchical Clustering:** Ward's minimum-variance method was applied to $z$-score-normalised summary features (start/end coordinates, arc length, mean curvature) to detect groups of geometrically similar copies — "stability plateaus" indicating periods of uninterrupted press work.

3. **Pairwise Distance Metrics:** Euclidean, Dynamic Time Warping (DTW), discrete Fréchet, and Procrustes distances were computed between all pairs of traces to validate that clustering results were robust across metric choice.

## 3. Results

### 3.1 Persistent Presence

The filament mark was identified and traced in all 55 copies examined. Arc lengths ranged from 155 to 350 pixels. The mark's universality and geometric consistency across copies from 23 independent collections confirms it as a persistent feature of the printing surface rather than a transient debris artefact or image processing artefact.

### 3.2 A Dominant Axis of Variation

PCA of the aligned shape vectors reveals that the first principal component accounts for 73.3% of total shape variance. The first two components together account for 97.9%, indicating that the filament's variability is overwhelmingly low-dimensional. When traces are projected onto PC1 and PC2, a dense central cluster and a small number of geometric outliers (FF2O3V-042, 028, 032, 035) are visible (Fig. 3).

### 3.3 Monotonic Drift

The PC1 scores correlate with geometric summary features as follows (Spearman $\rho$, all $n = 55$):

| Feature | $\rho$ | $p$ | Interpretation |
|---------|--------|-----|----------------|
| Centroid $x$ | 0.984 | $< 10^{-40}$ | Drift is overwhelmingly horizontal |
| Arc length | 0.726 | $< 10^{-9}$ | Filament elongated along the Primary Drift Component |
| Tortuosity | −0.064 | n.s. | Shape complexity unchanged |
| Centroid $y$ | — | — | Weak or absent vertical component |

The near-perfect correlation with centroid $x$ confirms that PC1 represents a unidirectional horizontal displacement. The gradient overlay (Fig. 4) provides visual confirmation: traces coloured by PC1 rank form a smooth spectral sweep across the crop window, consistent with the filament migrating steadily from left to right (or equivalently, from right to left, since direction is relative) across the forme during the print run.

### 3.4 Stability Plateaus

Hierarchical clustering (Ward's method, 12-cluster cut) identifies one dominant cluster comprising 23 copies (42% of the dataset), designated the "Long Run" (Cluster 9). Within this cluster, the $x$-coordinate of the filament start point varies by only ~15 pixels, compared to a full-dataset range exceeding 200 pixels. This low internal variance implies that the filament position was effectively stable across these 23 impressions — consistent with a sustained, uninterrupted sequence of press work.

A secondary stable cluster (Cluster 10) contains 6 copies with a distinct position and curvature profile. Several transitional copies (e.g., FF2O3V-032, 042, 046) are geometric singletons that cluster poorly — likely capturing the filament at moments of active displacement between stability states.

The block-diagonal structure observed in the pairwise distance matrices (DTW, Fréchet, Procrustes) corroborates this picture: the same groups emerge regardless of the distance metric employed (Fig. 8; supplementary).

### 3.5 A Candidate Relative Ordering

Ranking the 55 copies by PC1 score produces a candidate relative ordering consistent with progressive geometric drift. Copies at one extreme (FF2O3V-042, 034, 054, 001) exhibit compact, left-shifted filament positions; copies at the other extreme (FF2O3V-038, 023, 026, 010, 006) are elongated and right-shifted. The Long Run occupies the middle ranks, consistent with its interpretation as the longest uninterrupted printing sequence.

This ordering is relative, not absolute. We cannot determine which extreme corresponds to the beginning of the run without external evidence (e.g., correlation with known type-damage sequences or paper-stock changes). The direction of the drift is irrecoverable from geometric data alone.

## 4. Discussion

### 4.1 Mechanism

The filament's behaviour is best characterised as a slow, systematic drift punctuated by discrete jumps between stability plateaus. The drift component is captured by PC1 (a smooth monotonic trend); the jumps are captured by the clustering structure (tight groups separated by geometric discontinuities). These two observations are not in tension — they describe the same process at different scales. Over the full run, the filament migrated directionally; within that overall trajectory, it spent most of its time locked in a small number of stable configurations.

The correlation with arc length ($\rho = 0.726$) admits two physical interpretations: (i) the filament physically stretched under the repeated compressive force of impression, or (ii) it progressively re-seated at a more oblique angle across the fixed crop window, geometrically lengthening the visible trace without material deformation. Analysis of uncropped images, where the filament may extend beyond the current crop boundary, would disambiguate these hypotheses. Both mechanisms are consistent with the observed monotonicity.

The null result for tortuosity ($\rho = -0.064$) is informative: the filament moved and lengthened, but it did not buckle, kink, or become more complex in shape. This is consistent with a fibre under tension — an unconstrained fibre subject to random impingements would be expected to develop increasing tortuosity over time.

### 4.2 Relationship to Existing Chronologies

The filament chronometer operates at a different scale from Hinman's compositor-based analysis, which reconstructs the order of formes and quires across the entire Folio. The filament evidence applies exclusively to the inner forme of quire $oo$, leaf 2o3v. Within that scope, it may provide finer local resolution than traditional methods — potentially distinguishing between impressions within a single forme’s run.

To link the filament-based relative ordering to Hinman's framework, one would need to identify copies whose printing-sequence position is independently constrained (e.g., through watermark evidence, identifiable paper stocks, or datable type damage in other formes of the same sheet). This correlation remains future work.

### 4.3 Limitations

1. **Sample fraction.** Our 55 copies represent approximately 4–7% of the estimated 750–1,500 copies printed (Blayney 1991). The true printing sequence may include stability plateaus and transitional states not represented in our sample.

2. **Operator bias in tracing.** Semi-automated hand tracing introduces a human low-pass filter. Operator consistency was not formally assessed across sessions, though all tracing was performed in a single session to minimise intra-operator variability.

3. **Registration residuals.** Despite dynamic registration, sub-pixel alignment errors remain. These contribute noise to the shape vectors but cannot produce the systematic trends observed.

4. **Post-press disturbance.** Replacement leaves inserted during 17th- or 18th-century rebinding would appear as anomalous outliers in the geometric analysis. Our singleton copies (e.g., FF2O3V-042) could include such cases, though we have no provenance evidence to confirm or exclude this.

5. **Directional ambiguity.** The filament evidence establishes a relative ordering but cannot determine its polarity: we know the sequence but not which end is "first."

## 5. Conclusion

The "wandering filament" of leaf 2o3v is a verifiable, continuously evolving physical defect that appears to encode information consistent with the relative order of printing within a single forme of the Shakespeare First Folio. Its monotonic drift (PC1 = 73.3%, $\rho_{\text{centroid}} = 0.984$) and discrete stability plateaus (the "Long Run" of 23 copies) suggest that geometric morphometrics may recover printing-sequence information from features previously dismissed as minor blemishes. While its scope is localised to one forme and its chronology is relative, the wandering filament illustrates the untapped potential of micro-defect analysis in analytical bibliography.

## References

- Blayney, Peter W. M. 1991. *The First Folio of Shakespeare*. Washington, D.C.: Folger Shakespeare Library.
- Hinman, Charlton. 1963. *The Printing and Proof-Reading of the First Folio of Shakespeare*. 2 vols. Oxford: Clarendon Press.

## Supplementary Materials

- **Table S1:** Full corpus listing with institution, shelfmark/copy number, IIIF source URL, and registration method (auto/manual).
- **Figure S1:** Pairwise distance matrices (Euclidean, DTW, Fréchet, Procrustes).
- **Interactive Dashboard:** `filament_dashboard.html` — self-contained HTML file with toggle between chronological and cluster colouring, median composite background, and geographic map.
