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

- Keep the public site on a single scrolling index route, as the brief explicitly requests smooth section navigation.
- Store bilingual project records and the shared booking destination in the site data module so replacements stay centralized.
- Use the lang search parameter for language selection and route-specific metadata, so French and English views are shareable and server-rendered.
- Keep hero media as a compressed asset-backed video with a local poster and respect reduced motion to preserve loading speed and accessibility.
