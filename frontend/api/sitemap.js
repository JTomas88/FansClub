export default function handler(req, res) {
  const lastmod = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.siennafans.club/</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.siennafans.club/quienessienna</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.siennafans.club/objetivoscf</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.siennafans.club/links</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://www.siennafans.club/contacto</loc>
    <lastmod>${lastmod}</lastmod>
    <priority>0.8</priority>
  </url>
</urlset>`);
}
