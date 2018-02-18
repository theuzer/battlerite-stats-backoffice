module.exports = {
  logType: {
    allTime: 'AllTime',
    lastMonth: 'LastMonth',
    lastWeek: 'LastWeek',
    yesterday: 'Yesterday',
  },
  undefined: 'undefined',
  api: {
    accept: 'application/vnd.api+json',
    playerUrl: playerId => `https://api.dc01.gamelockerapp.com/shards/global/players/${playerId}`,
    keys: {
      key1: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI5NzY2ZDY3MC1mNjFlLTAxMzUtY2YzNC0wYTU4NjQ2MGE2NmQiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTE4ODc4NTAxLCJwdWIiOiJzdHVubG9jay1zdHVkaW9zIiwidGl0bGUiOiJiYXR0bGVyaXRlIiwiYXBwIjoicGxheWVyLWFwcCIsInNjb3BlIjoiY29tbXVuaXR5IiwibGltaXQiOjEwfQ.mssDaNyF4aBa1q1G8u89ZSoqPQdTAiiWCcPoKG3KSkM',
      key2: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiJlZjdlNjYyMC1mNjFlLTAxMzUtZDg2OS0wYTU4NjQ2MDE5MGQiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTE4ODc4NjQ5LCJwdWIiOiJzdHVubG9jay1zdHVkaW9zIiwidGl0bGUiOiJiYXR0bGVyaXRlIiwiYXBwIjoiYmF0dGxlLWFwcCIsInNjb3BlIjoiY29tbXVuaXR5IiwibGltaXQiOjEwfQ.q272oFVW6dHJoB8nTE1ZfFKqW8q1jxbv5zilHNC-xaY',
      key3: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIwNzY4YmU1MC1mNjFmLTAxMzUtZDQzNy0wYTU4NjQ2MDE5MGMiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTE4ODc4Njg5LCJwdWIiOiJzdHVubG9jay1zdHVkaW9zIiwidGl0bGUiOiJiYXR0bGVyaXRlIiwiYXBwIjoibG9hZG91dHMtMzQ1ZmE4ZWUtYWUxZi00MDQ1LTkwMGUtZTFkNzRhYjNlYTNmIiwic2NvcGUiOiJjb21tdW5pdHkiLCJsaW1pdCI6MTB9.Svu-afcXFbl5bNjT90G-WOqNG2mggKx-PAyVpmwe3_8',
      key4: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIxODczNDg3MC1mNjFmLTAxMzUtY2YzNi0wYTU4NjQ2MGE2NmQiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTE4ODc4NzE4LCJwdWIiOiJzdHVubG9jay1zdHVkaW9zIiwidGl0bGUiOiJiYXR0bGVyaXRlIiwiYXBwIjoidGVzdC1hcHBsaWNhdGlvbiIsInNjb3BlIjoiY29tbXVuaXR5IiwibGltaXQiOjEwfQ.9p7JagL0SdXylkbrtyZ8Ffw39kI2ebe6vIJxahSuqAc',
      key5: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJqdGkiOiIyMmRkMjZmMC1mNjFmLTAxMzUtZjg0My0wYTU4NjQ2MGE3YjEiLCJpc3MiOiJnYW1lbG9ja2VyIiwiaWF0IjoxNTE4ODc4NzM1LCJwdWIiOiJzdHVubG9jay1zdHVkaW9zIiwidGl0bGUiOiJiYXR0bGVyaXRlIiwiYXBwIjoibGF0ZXN0LXRlc3QiLCJzY29wZSI6ImNvbW11bml0eSIsImxpbWl0IjoxMH0.selkEoYTOKikTQbbho3iz9QU7DvB1IeaiY8Ns6zWUjI',
    },
  },
};
