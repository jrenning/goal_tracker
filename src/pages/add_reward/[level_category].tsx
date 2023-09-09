import { useRouter } from 'next/router'
import React from 'react'

function levelCategoryAdd() {
  const router = useRouter();
  //@ts-ignore
  const router_data: string = (router.query.level_category as string)
    ? router.query.level_category
    : "";

    const [level, category] = router_data.split("-")

  return <div>levelCategoryAdd</div>;
}

export default levelCategoryAdd