export default function formatPeggyError(e, source) {

    const line = e.location?.start?.line;
    const col = e.location?.start?.column;

    let message = `❌ Syntax Error vachindi\n`;
    message += `📍 Line ${line}, Column ${col}\n`;

    if (line) {
        const codeLine = source.split("\n")[line - 1];

        message += `\n${codeLine}\n`;
        message += `${" ".repeat(col - 1)}^\n`;
    }

    if (e.found)
        message += `\n👉 Found: "${e.found}"`;

    if (e.expected) {
        const expected = e.expected
            .map(x => x.text || x.description)
            .filter(Boolean)
            .join(", ");

        message += `\n👉 Expected: ${expected}`;
    }

    message += `\n\n💡 Hint: Konchem syntax check cheyyi.`;

    return message;
}
