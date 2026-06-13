
export function StringIsNullOrWhiteSpace(value?: string): boolean {
    if (value == null)
        return true;

    if (value.trim() === "")
        return true;

    return false;
}


export function StringToBase64(value: string): string {
    return btoa(
        new TextEncoder()
            .encode(value)
            .reduce((data, byte) => data + String.fromCharCode(byte), "")
    );
}

export function StringFromBase64(value: string): string {
    const bytes = Uint8Array.from(atob(value), char => char.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}