import React from 'react'
import { api } from '~/utils/api';

function ResetStatsButton() {

const reset_call = api.user.resetUserStats.useMutation()

const resetStats = async () => {
    await reset_call.mutateAsync()
}

  return (
    <button
      onClick={() => resetStats()}
      className="w-20 h-10 rounded-md bg-red-300 hover:bg-red-100"
    >
      Reset Stats
    </button>
  );
}

export default ResetStatsButton