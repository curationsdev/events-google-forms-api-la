# Cloudflare DNS Setup for la.curations.dev

## DNS Records Configuration

To set up `la.curations.dev` to point to your GitHub Pages site, add the following DNS records in your Cloudflare dashboard:

### Required DNS Records

#### Option 1: CNAME Record (Recommended)
```
Type: CNAME
Name: la
Content: curationsdev.github.io
Proxy status: Proxied (orange cloud)
TTL: Auto
```

#### Option 2: A Records (Alternative)
If you prefer A records, use GitHub's IP addresses:
```
Type: A
Name: la
Content: 185.199.108.153
Proxy status: Proxied (orange cloud)
TTL: Auto

Type: A
Name: la
Content: 185.199.109.153
Proxy status: Proxied (orange cloud)
TTL: Auto

Type: A
Name: la
Content: 185.199.110.153
Proxy status: Proxied (orange cloud)
TTL: Auto

Type: A
Name: la
Content: 185.199.111.153
Proxy status: Proxied (orange cloud)
TTL: Auto
```

## GitHub Pages Configuration

1. **CNAME File**: A `CNAME` file has been added to the repository with `la.curations.dev`
2. **Custom Domain**: This will be automatically configured when the deployment completes

## Cloudflare Settings Recommendations

### SSL/TLS Settings
- **SSL/TLS encryption mode**: Full (strict)
- **Always Use HTTPS**: On
- **HTTP Strict Transport Security (HSTS)**: Enable with these settings:
  - Max-age: 6 months
  - Include subdomains: On
  - Preload: On

### Performance Settings
- **Auto Minify**: Enable HTML, CSS, and JavaScript
- **Brotli**: On
- **Early Hints**: On

### Page Rules (Optional)
Create a page rule for `la.curations.dev/*`:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 month
- Browser Cache TTL: 4 hours

## Verification Steps

1. **DNS Propagation**: Use `dig la.curations.dev` or online DNS checkers
2. **SSL Certificate**: Verify HTTPS works without warnings
3. **Form Functionality**: Test form submission after setup
4. **Mobile Testing**: Ensure responsive design works

## Troubleshooting

### Common Issues

**DNS not resolving:**
- Wait 5-10 minutes for Cloudflare propagation
- Clear DNS cache: `sudo dscacheutil -flushcache` (macOS)
- Use incognito/private browsing

**SSL Certificate errors:**
- Ensure Cloudflare SSL mode is "Full (strict)"
- Wait for GitHub Pages to provision SSL (can take up to 24 hours)
- Check that CNAME file contains exactly: `la.curations.dev`

**404 Errors:**
- Verify GitHub Pages is enabled with "GitHub Actions" source
- Check that the deployment workflow completed successfully
- Ensure CNAME file is in the repository root

**Form not working:**
- Update Google Forms entry IDs in the JavaScript
- Test Google Form directly first
- Check browser console for JavaScript errors

## Estimated Propagation Time

- **Cloudflare DNS**: 2-5 minutes
- **GitHub Pages SSL**: 10-60 minutes
- **Global propagation**: Up to 24 hours

## Support

If you encounter issues:
1. Check GitHub Actions logs: https://github.com/curationsdev/events-google-forms-api-la/actions
2. Test DNS: https://dnschecker.org
3. SSL Test: https://www.ssllabs.com/ssltest/

---

**Quick Setup Checklist:**
- [ ] Add CNAME record in Cloudflare: `la` → `curationsdev.github.io`
- [ ] Enable proxy (orange cloud) in Cloudflare
- [ ] Wait for DNS propagation (5-10 minutes)
- [ ] Verify site loads at https://la.curations.dev
- [ ] Test form submission functionality