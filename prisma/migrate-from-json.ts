// prisma/migrate-from-json.ts

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Define a estrutura esperada do nosso db.json
interface OldDb {
    users: any[];
    receipts: any[];
}

async function main() {
    console.log('Iniciando a migração do db.json para o PostgreSQL...');

    // 1. Ler o arquivo db.json
    const dbJsonPath = path.join(process.cwd(), 'db.json');
    if (!fs.existsSync(dbJsonPath)) {
        throw new Error('Arquivo db.json não encontrado na raiz do projeto.');
    }
    const oldData: OldDb = JSON.parse(fs.readFileSync(dbJsonPath, 'utf-8'));

    // 2. Limpar as tabelas atuais para evitar duplicatas (CUIDADO!)
    // Isso garante que possamos rodar o script várias vezes sem criar dados duplicados.
    console.log('Limpando tabelas existentes...');
    await prisma.receipt.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('Tabelas limpas.');

    // 3. Migrar os Usuários e Mapear os IDs
    // Precisamos mapear os IDs antigos do JSON para os novos IDs gerados pelo PostgreSQL.
    const oldIdToNewIdMap = new Map<number, number>();

    console.log(`Encontrados ${oldData.users.length} usuários para migrar...`);
    for (const oldUser of oldData.users) {
        const newUser = await prisma.user.create({
            data: {
                email: oldUser.email,
                name: oldUser.name,
                password: oldUser.password, // A senha já está criptografada!
                mustChangePassword: oldUser.mustChangePassword ?? false,
                createdAt: new Date(oldUser.createdAt),
            },
        });
        // Mapeia o ID antigo (do JSON) para o novo ID (do banco)
        oldIdToNewIdMap.set(oldUser.id, newUser.id);
        console.log(`- Usuário ${newUser.email} migrado com sucesso.`);
    }

    // 4. Migrar os Recibos usando o Mapeamento de IDs
    console.log(`Encontrados ${oldData.receipts.length} recibos para migrar...`);
    for (const oldReceipt of oldData.receipts) {
        const newUserId = oldIdToNewIdMap.get(oldReceipt.createdBy);

        // Pula recibos de usuários que não existem mais
        if (!newUserId) {
            console.warn(`- Pulando recibo ${oldReceipt.id} pois o usuário criador (ID: ${oldReceipt.createdBy}) não foi encontrado.`);
            continue;
        }

        await prisma.receipt.create({
            data: {
                // Campos do recibo
                date: new Date(oldReceipt.date), // Converte string para Date
                number: oldReceipt.number,
                clientName: oldReceipt.clientName,
                companyName: oldReceipt.companyName,
                address: oldReceipt.address,
                cpfCnpj: oldReceipt.cpfCnpj,
                requester: oldReceipt.requester,
                passengers: oldReceipt.passengers,
                services: oldReceipt.services, // Prisma aceita o JSON diretamente
                observations: oldReceipt.observations,
                language: oldReceipt.language,
                grandTotal: oldReceipt.grandTotal,
                createdAt: new Date(oldReceipt.createdAt),

                // Conecta o recibo ao novo ID do usuário
                createdById: newUserId,
            },
        });
        console.log(`- Recibo número ${oldReceipt.number} migrado com sucesso.`);
    }

    console.log('🎉 Migração concluída com sucesso!');
}

main()
    .catch((e) => {
        console.error('Ocorreu um erro durante a migração:', e);
        process.exit(1);
    })
    .finally(async () => {
        // Garante que a conexão com o banco seja fechada
        await prisma.$disconnect();
    });