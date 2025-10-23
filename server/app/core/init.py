from app.core.database import database, tenants_table, user_table
from app.core.constants import OPEN_USER_EMAIL, OPEN_USER_ROLE, OPEN_TENANT_NAME

async def bootstrap_open_mode_defaults():
    # Only one process at a time
    await database.execute("SELECT pg_advisory_lock(123456789);")
    try:
        tenant = await database.fetch_one(
            tenants_table.select().where(tenants_table.c.name == OPEN_TENANT_NAME)
        )
        if not tenant:
            tenant_id = await database.execute(
                tenants_table.insert().values(name=OPEN_TENANT_NAME)
            )
        else:
            tenant_id = tenant.id

        user = await database.fetch_one(
            user_table.select().where(user_table.c.email == OPEN_USER_EMAIL)
        )
        if not user:
            await database.execute(
                user_table.insert().values(
                    email=OPEN_USER_EMAIL,
                    password=None,
                    role=OPEN_USER_ROLE,
                    tenant_id=tenant_id,
                )
            )
    finally:
        await database.execute("SELECT pg_advisory_unlock(123456789);")
