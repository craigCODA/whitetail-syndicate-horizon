# Whitetail Syndicate — Shopify Horizon Theme

This repository contains the approved local Horizon theme source for the Whitetail Syndicate storefront.

**Branch:** `main` (intended Shopify GitHub integration testing branch)

**Status:** For an **unpublished** Shopify theme only. Do not publish or replace the current live Horizon theme until the store owners complete their review.

### Included

- Whitetail homepage, existing products and collection presentation, and custom theme assets
- Hunter story thumbnail and dark-theme reading page for **Wait Till He Turns**
- Rut Line signup and general Whitetail community signup
- Side-by-side **Become part of the story** inquiry form

### Required test steps in Shopify

1. Connect this repository's `main` branch using **Online Store → Themes → Add theme → Connect from GitHub**. Leave the new theme unpublished.
2. Open its theme preview; confirm homepage sections, photos, typography, products, navigation, and mobile layout.
3. Confirm the full story page exists and has the correct template assignment and link. A theme alone does not necessarily create Shopify Page records.
4. Submit test emails for Rut Line and community newsletter, then confirm customer records and source tags in Shopify.
5. Submit a test story-offer inquiry and confirm the message arrives at **info@whitetailsyndicate.com**. Native Shopify contact forms use Shopify's configured merchant notification routing; the destination cannot be independently guaranteed by theme code.
6. Keep the theme unpublished until all tests pass and the owners explicitly approve publication.

Shopify's GitHub integration makes **two-way** changes: Shopify theme-editor saves create commits back to the selected branch. Do not share the test branch with the live theme.

Source: `Whitetail_Syndicate_Horizon_Story_Offer_Local.zip` approved for GitHub preparation. The theme itself is preserved byte-for-byte, with only this README and a `.gitignore` added.
