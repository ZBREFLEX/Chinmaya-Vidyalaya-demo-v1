// Display-only repair of legacy website encoding. Raw source wording stays intact.
export const readableLifeText = text => text.replaceAll('â€“', '–').replaceAll('â€”', '—').replaceAll('Ã¢â‚¬Å“', '“').replaceAll('Ã¢â‚¬"', '—').replace(/ðŸ[^ ]*/g, '').replaceAll('\u0000', '');
