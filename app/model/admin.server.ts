import { comparePassword, hashPassword } from '~/utils/hashedPassword'
import { prisma } from './db.server'
import { Manager } from './model'

export async function getAdmin(id: string) {
    return prisma.manager.findUnique({
        where: { id: id },
    })
}

export async function isValidAdmin(admin: Manager) {
    console.log('::', admin)
    if (!admin.id || !admin.password) {
        return false
    }

    const manager = await getAdmin(admin.id)
    return manager?.id === admin.id && (await comparePassword(admin.password, manager.password))
}

export async function isExistAdmin(adminId: string) {
    const existingAdmin = await prisma.manager.findFirst({
        where: { id: adminId },
    })
    if (existingAdmin) {
        return true
    }
    return false
}

export async function isExistAdminByUuid(uuid: string) {
    const existingAdmin = await prisma.manager.findUnique({
        where: { uuid: uuid },
    })
    if (existingAdmin) {
        return true
    }
    return false
}

export async function createAdmin(admin: Manager) {
    if (!admin.id || !admin.password) {
        return false
    }
    const existingAdmin = await isExistAdmin(admin.id)
    if (existingAdmin) {
        return false
    }

    const hashedPassword = await hashPassword(admin.password)

    await prisma.manager.create({
        data: { id: admin.id, password: hashedPassword },
    })

    return true
}

export async function updateAdmin(admin: Manager) {
    return prisma.manager.update({
        where: { id: admin.id },
        data: { password: admin.password },
    })
}
