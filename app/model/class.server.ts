import { isExistAdmin, isExistAdminByUuid } from './admin.server'
import { prisma } from './db.server'
import { Class } from './model'

export async function getClassList(classAdmin: string) {
    const classes = await prisma.class.findMany({
        where: {
            managerUuid: classAdmin,
        },
    })

    return classes
}

export async function getClass(classUuid: string) {
    return prisma.class.findUnique({
        where: {
            uuid: classUuid,
        },
    })
}

export async function getClassById(classId: string) {
    return prisma.class.findFirst({
        where: {
            id: classId,
        },
    })
}

export async function createClass(adminUuid: string, cls: Class) {
    if (!adminUuid || !cls.id) {
        return false
    }

    console.log('before isExistAdminByUuid')
    const manager = await isExistAdminByUuid(adminUuid)
    if (!manager) {
        return false
    }

    console.log('before exsistingClass')
    const existingClass = await prisma.class.findFirst({
        where: {
            managerUuid: adminUuid,
            name: cls.name,
        },
    })
    console.log(existingClass)
    if (existingClass) {
        return false
    }

    await prisma.class.create({
        data: {
            id: cls.id,
            name: cls.name,
            managerUuid: adminUuid,
        },
    })
    console.log('good')
    return true
}

export async function updateClass(cls: Class) {
    return prisma.class.update({
        where: {
            uuid: cls.uuid,
        },
        data: {
            name: cls.name,
        },
    })
}
