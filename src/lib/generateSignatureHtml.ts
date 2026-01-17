export interface SignatureData {
  name: string;
  title: string;
  company: string;
  phone: string;
  twitter: string;
  websiteUrl: string;
  logoUrl: string;
}

export function generateSignatureHtml(data: SignatureData): string {
  const { name, title, company, phone, twitter, websiteUrl, logoUrl } = data;

  // Build the title/company line with comma separator
  const titleParts = [title, company].filter(Boolean);
  const titleLine = titleParts.join(', ');

  // Build the contact line
  const contactParts = [];
  if (phone) contactParts.push(phone);
  if (twitter) contactParts.push(`@${twitter}`);
  const contactLine = contactParts.join(' • ');

  // Build logo row
  let logoRow = '';
  if (logoUrl) {
    const logoImg = `<img src="${logoUrl}" alt="Company Logo" width="60" height="60" style="border-radius: 8px; display: block;">`;
    if (websiteUrl) {
      logoRow = `
  <tr>
    <td style="padding-bottom: 12px;">
      <a href="${websiteUrl}" style="text-decoration: none;">
        ${logoImg}
      </a>
    </td>
  </tr>`;
    } else {
      logoRow = `
  <tr>
    <td style="padding-bottom: 12px;">
      ${logoImg}
    </td>
  </tr>`;
    }
  }

  // Build name row (required)
  const nameRow = name ? `
  <tr>
    <td>
      <strong style="font-size: 16px; color: #1a1a1a;">${escapeHtml(name)}</strong>
    </td>
  </tr>` : '';

  // Build title/company row
  const titleRow = titleLine ? `
  <tr>
    <td style="font-size: 14px; color: #6b7280;">
      ${escapeHtml(titleLine)}
    </td>
  </tr>` : '';

  // Build contact row
  const contactRow = contactLine ? `
  <tr>
    <td style="font-size: 14px; color: #6b7280; padding-top: 4px;">
      ${escapeHtml(contactLine)}
    </td>
  </tr>` : '';

  return `<table cellpadding="0" cellspacing="0" border="0" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">${logoRow}${nameRow}${titleRow}${contactRow}
</table>`;
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
