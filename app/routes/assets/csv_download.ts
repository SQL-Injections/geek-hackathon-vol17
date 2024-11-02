import { LoaderFunctionArgs } from "@remix-run/node"

export async function loader({ request } : LoaderFunctionArgs) {
    const formData = await request.formData()
    return new Response(
        formData.get("class_id"),
        {
            headers: {
                "Content-Type": "text/csv; charset=cp932",
                "Content-Disposition": `attachement;filename="data.csv"`
            },
        }
    )
}