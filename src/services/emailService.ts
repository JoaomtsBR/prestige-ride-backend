// src/services/emailService.ts (NOVA VERSÃO)

import nodemailer from 'nodemailer';

// 1. Cria o 'transportador' (o cliente SMTP)
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465, // Porta do SSL
    secure: true, // true para a porta 465
    auth: {
        user: process.env.GMAIL_USER,       // Seu e-mail do Gmail
        pass: process.env.GMAIL_APP_PASSWORD, // Sua senha de app de 16 dígitos
    },
});

/**
 * Envia um e-mail.
 * @param to E-mail do destinatário
 * @param subject Assunto do e-mail
 * @param html Corpo do e-mail em HTML
 */
export async function sendEmail(to: string, subject: string, html: string) {
    try {
        const info = await transporter.sendMail({
            from: `"Angel Car Locadora" <${process.env.GMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html,
        });

        console.log("E-mail enviado com sucesso: %s", info.messageId);
        return info;

    } catch (error) {
        console.error("Erro ao enviar e-mail pelo Gmail: ", error);
        throw new Error("Falha ao enviar e-mail.");
    }
}