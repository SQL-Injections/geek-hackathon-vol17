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
    //addClassですでにやっている処理なので削除

    console.log('before exsistingClass')
    const existingClass = await prisma.class.findFirst({
        where: {
            managerUuid: adminUuid,
            name: cls.name,
        },
    })
    console.log("これはnullでいいやつ : ",existingClass)
    if (existingClass) {
        return false
    }

    let new_class = await prisma.class.create({
        data: {
            id: cls.id,
            name: cls.name,
            managerUuid: adminUuid,
        },
    })
    console.log('good')
    return new_class
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
