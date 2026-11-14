<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the portfolio on the existing TanStack Start router; the homepage uses the dedicated night-portfolio component (reference-site style) to avoid overlapping legacy cinematic controls.
- Keep verified personal data in the portfolio content module and animate it with one requestAnimationFrame scheduler and IntersectionObserver; this isolates animation state from factual content.
- Restore original creative media through the shared content catalog and a separate gallery with accessible image and video dialogs; this prevents duplicate asset lists and preserves playable work.
- Keep chatbot threads in a root-mounted in-memory session with route-derived IDs and no browser/database persistence; refresh intentionally clears conversations.
- Use AI Elements for chat controls and a server-only Gemini connector stream; validate messages and keep credentials and provider diagnostics out of browser responses.
