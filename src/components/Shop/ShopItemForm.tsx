import React, { FormEvent } from 'react'
import Form from '../UI/Form'
import { api } from '~/utils/api'
import usePopup from '~/hooks/usePopup'
import SubmitButton from '../UI/SubmitButton'

type ShopFormProps = {
    backlink: string
}

function ShopItemForm({backlink}: ShopFormProps) {

    const utils = api.useContext()
    const {setErrorPopup, setSuccessPopup} = usePopup()

    const shop_item = api.shop.createShopItem.useMutation({
        async onSuccess(data) {
            await utils.shop.invalidate()
            setSuccessPopup(`Created item ${data.name}`)
        },
        async onError(err) {
            setErrorPopup(`Couldn't add shop item, ${err}`)
        }
    })

    const createShopItem = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const target = e.target as typeof e.target & {
            name: {value: string}
            cost: {value: string}

        }



        await shop_item.mutateAsync({
            name: target.name.value,
            cost: Number(target.cost.value),
        })


    }



  return (
    <Form backlink={backlink} submitFunction={createShopItem}>
        <label htmlFor='name'>
            Name
        </label>
        <input type='text' required={true} id="name"/>
        <label htmlFor='cost'>Cost</label>
        <input type="number" required={true} id="cost"/>
        <SubmitButton />
    </Form>
  )
}

export default ShopItemForm