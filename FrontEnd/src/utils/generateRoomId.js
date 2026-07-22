export function generateRoomId(Service_Id, userIdA, userIdB) {


const minUserId = Math.min(userIdA, userIdB);
const maxUserId = Math.max(userIdA, userIdB);


return `${Service_Id}_${minUserId}_${maxUserId}`

}