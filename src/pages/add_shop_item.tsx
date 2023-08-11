import React, { useState } from "react";
import PopupTransitionLayout from "~/components/Transitions/PopupTransitionLayout";
import { authOptions } from "./api/auth/[...nextauth]";
import { getServerSession } from "next-auth";
import ShopItemForm from "~/components/Shop/ShopItemForm";

function add_shop_item() {
  return (
    <PopupTransitionLayout keyName="add_goal">
      <div className="h-full w-screen bg-green-50">
        <ShopItemForm backlink="/shop" />
      </div>
    </PopupTransitionLayout>
  );
}

export default add_shop_item;

//@ts-ignore
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
