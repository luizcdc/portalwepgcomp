interface ContactRequest {
    name: string;
    email: string;
    text: string;
}

export const sendContactRequest = async (data: ContactRequest): Promise<void> => {
    try {
        const response = await fetch("http://localhost:3000/mailing/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error("Erro ao enviar os dados!");
        }
    } catch (error) {
        console.error("Erro ao enviar o formulário:", error);
        throw new Error("Erro ao enviar o formulário. Tente novamente.");
    }
};