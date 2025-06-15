from app.core.database import database, tenants_table, user_table
from app.core.constants import OPEN_USER_EMAIL, OPEN_USER_ROLE, OPEN_TENANT_NAME 

# this is required for usage logging in geoflip open/hosted deployments geoflip enterprise deployments will not use this as an admin user and tenant will be created instead
async def bootstrap_open_mode_defaults():
    tenant = await database.fetch_one(
        tenants_table.select().where(tenants_table.c.id == 1)
    )
    if not tenant:
        await database.execute(
            tenants_table.insert().values(
                name=OPEN_TENANT_NAME,
                provider_type=None,
                provider_tenant_id=None,
                email_domain=None
            )
        )

    user = await database.fetch_one(
        user_table.select().where(user_table.c.id == 1)
    )
    if not user:
        await database.execute(
            user_table.insert().values(
                email=OPEN_USER_EMAIL,
                password=None,
                role=OPEN_USER_ROLE,
                tenant_id=1
            )
        )
