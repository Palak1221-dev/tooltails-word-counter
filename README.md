# ToolTails Word Counter & Text Analyzer

A professional, privacy-first online word counter and text analysis suite. All content is processed securely 100% locally in the user's browser, making it ideal for sensitive drafts, code, and documentation.

## 🚀 Features
- **Linguistic Metrics**: Words, characters, characters without spaces, sentences, paragraphs, and unique words.
- **Advanced Insights**: Estimate reading and speaking times based on standard rates; analyze readability scores (Flesch-Kincaid Grade Level); view key terms density.
- **Draft Transformations**: Instantly change selection or text case (UPPERCASE, lowercase, Title Case).
- **Text Cleanup Suite**: Clean extra spaces, strip blank line breaks, normalize punctuation, remove duplicated words, or strip punctuation cleanly.
- **Fully Responsive**: Stacks and wraps interface controls elegantly on mobile (tested down to 320px).

---

## 🛠️ Commands

All commands are run from the project root:

| Command | Action |
| :--- | :--- |
| `npm install` | Installs project dependencies |
| `npm run dev` | Starts local development server at `http://localhost:4321` |
| `npm run build` | Compiles the production site into standard static files inside `./dist/` |
| `npm run preview` | Previews the compiled build locally |

---

## 🔍 Google Search Console Verification Configuration

You can configure site verification for search engines (like Google Search Console) dynamically.

### Where to Place the Verification Code

1. Create a `.env` file in the root directory of this project (`C:/word counter/.env`).
2. Add your verification code using either of the following environment variable configurations:
   ```env
   # Public (recommended for client-side injection visibility)
   PUBLIC_GOOGLE_SITE_VERIFICATION=your_gsc_verification_code_here
   
   # Or Private (resolved server-side during compilation)
   GOOGLE_SITE_VERIFICATION=your_gsc_verification_code_here
   ```
3. Run the build command (`npm run build`). The static build will parse this variable and inject the GSC verification `<meta>` tag into the head of all generated pages:
   ```html
   <meta name="google-site-verification" content="your_gsc_verification_code_here">
   ```

---

## 📊 Microsoft Clarity Integration

You can configure Microsoft Clarity dynamically to collect user behavior analytics globally across all pages.

### Where to Place the Clarity Project ID

1. Create or open the `.env` file in the root directory of this project (`C:/word counter/.env`).
2. Add your Clarity Project ID using either of the following environment variable configurations:
   ```env
   # Public (recommended)
   PUBLIC_CLARITY_PROJECT_ID=your_clarity_project_id_here
   
   # Or Private (resolved during compilation)
   CLARITY_PROJECT_ID=your_clarity_project_id_here
   ```
3. Run the build command (`npm run build`). The Astro compiler will parse the project ID and inject the non-blocking Microsoft Clarity script snippet into the `<head>` of all generated HTML pages:
   ```html
   <script type="text/javascript">
       (function(c,l,a,r,i,t,y){
           c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
           t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/your_clarity_project_id_here";
           y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
       })(window,document,"clarity","script","your_clarity_project_id_here");
   </script>
   ```

