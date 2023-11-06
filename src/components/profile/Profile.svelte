<script>
    import {onMount} from "svelte";
    import {
        addFriendRequest,
        getUserData,
        updateUser,
        acceptFriendRequest,
        declineFriendRequest,
        deleteFriend
    } from "../../firebase.js";
    import HiOutlineClipboardCopy from "svelte-icons-pack/hi/HiOutlineClipboardCopy";
    import TiTick from "svelte-icons-pack/ti/TiTick";
    import TiDelete from "svelte-icons-pack/ti/TiDelete";
    import RiSystemDeleteBin5Fill from "svelte-icons-pack/ri/RiSystemDeleteBin5Fill";
    import Icon from 'svelte-icons-pack/Icon.svelte';

    let userData;
    let imageBase64 = null;

    onMount(async () => {
        const sessionUser = sessionStorage.getItem('user');
        await getUserData(JSON.parse(sessionUser).uid).then((user) => {
            if (user) {
                userData = user;
            }
        })
    })

    const handleSubmit = async (e) => {
        e.preventDefault();
        let newUserData;
        if (e.target.nickname.value === '' && imageBase64 === null) {
            alert('Please enter a nickname or upload a profile picture');
            return;
        }
        if (imageBase64 === null) {
            newUserData = {
                nickname: e.target.nickname.value,
            }
        } else if (e.target.nickname.value === '') {
            newUserData =
            {
                photoURL: imageBase64
            }
        } else {
            newUserData =
            {
                nickname: e.target.nickname.value,
                photoURL: imageBase64
            }
        }
        await updateUser(userData.uid, newUserData);
        window.location.reload();
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 701486) {
                alert("File is too big! Please select a file smaller than 0.7MB.");
            } else {
                const reader = new FileReader();
                reader.onload = (event) => {
                    imageBase64 = event.target.result.split(',')[1];
                };
                reader.readAsDataURL(file);
            }
        }
    }

    const copyToClipboard = async () => {
        const textToCopy = document.getElementById("friend-code").textContent;

        try {
            await navigator.clipboard.writeText(textToCopy);
            alert('Copied to clipboard');
        } catch (err) {
            console.error("Unable to copy text: " + err);
        }
    }

    const addFriend = async () => {
        if (document.querySelector('.friend-input').value === '') {
            alert('Please enter a friend code');
            return;
        }
        if (document.querySelector('.friend-input').value === userData.uid) {
            alert('You cannot add yourself as a friend');
            return;
        }
        const error = await addFriendRequest(userData.uid, document.querySelector('.friend-input').value);
        if (error) {
            alert(error);
            document.querySelector('.friend-input').value = '';
            return;
        }
        alert('Friend request sent');
        document.querySelector('.friend-input').value = '';
    }

    const getFriendNames = async (friends) => {
        if (friends.length) {
            const requests = friends.map(async friendRequest => {
                console.log(friendRequest, 'friendRequest')
                const response = await getUserData(friendRequest);
                console.log(response, 'response');
                if (response) return {uid: friendRequest, nickname: response.nickname, photoURL: response.photoURL};
            });

            try {
                const responseRequests = await Promise.all(requests);
                return responseRequests;
            } catch (error) {
                console.error(error);
            }
        }

        return Promise.resolve([]);
    }

    const acceptFriend = async (userId, friendId) => {
        await acceptFriendRequest(userId, friendId);
        alert('Friend request accepted');
        window.location.reload();
    }

    const rejectFriend = async (userId, friendId) => {
        await declineFriendRequest(userId, friendId);
        alert('Friend request rejected');
        window.location.reload();
    }

    const removeFriend = async (userId, friendId) => {
        await deleteFriend(userId, friendId);
        alert('Friend removed');
        window.location.reload();
    }

</script>

{#if userData}
    <div class="profile-info">
        <div class="profile-frame">
            <img class='user-photo' src="data:image/png;base64, {userData.photoURL}" alt={'user profile picture'} />
        </div>
        <h1 class="user-name">{userData.nickname}</h1>
        <h2 class="user-email">({userData.email})</h2>

        <div class="update-profile-and-fcode-container">
            <div class="profile-content">
                <div class="update-profile-container">
                    <h2 class="update-profile-title">Update profile</h2>
                    <form on:submit={(e) => handleSubmit(e)}>
                        <input class="nickname-input" type="text" name="nickname" placeholder="Nickname" />
                        {#if imageBase64}
                            <img class='user-photo-uploaded' src="data:image/png;base64, {imageBase64}" alt="user profile picture" />
                        {/if}
                        <label class="custom-file-upload">
                            <input id='photo-input' type="file" accept="image/*" on:change={handleFileChange}/>
                            Upload avatar
                        </label>
                        <button type="submit">Save</button>
                    </form>
                </div>
                <div class="friend-code-container">
                    <div class="friend-code-title-copy">
                        <h2 class="friend-code-title">Friend code</h2>
                        <div class="friend-code-copy-icon" on:click={() => copyToClipboard()}><Icon src={HiOutlineClipboardCopy} /></div>
                    </div>
                    <p class="friend-code" id="friend-code">{userData.uid}</p>
                    <h2 class="friend-input-title">Add friend</h2>
                    <input class="friend-input" type="text" name="add a friend" placeholder="Add a friend" />
                    <button on:click={() => addFriend()}>Add friend</button>
                </div>
            </div>

            <div class="friends-and-requests-container">
                <div class="friends-container">
                    <h2 class="friend-code-title">Friends</h2>
                    {#if userData.friends.length === 0}
                        <p class="friend-code">You have no friends yet</p>
                    {:else}
                        {#await getFriendNames(userData.friends) then friendNames}
                            {#each friendNames as friendName}
                                <div class="friend-request">
                                    <div class="friend-request-data">
                                        <img class="friend-img" src="data:image/png;base64, {friendName.photoURL}"/>
                                        <p class="friend-request-name">{friendName.nickname}</p>
                                    </div>
                                    <div class="friend-request-buttons">
                                        <div class="friend-delete" on:click={() => removeFriend(userData.uid, friendName.uid)}><Icon src={RiSystemDeleteBin5Fill} /></div>
                                    </div>
                                </div>
                            {/each}
                        {/await}
                    {/if}
                </div>

                <div class="friend-requests-container">
                    <h2 class="friend-code-title">Friend requests</h2>
                    {#if userData.friendRequests.length === 0}
                        <p class="friend-code">You have no friend requests</p>
                    {:else}
                        {#await getFriendNames(userData.friendRequests) then friendNames}
                            {#each friendNames as friendName}
                            <div class="friend-request">
                                <div class="friend-request-data">
                                    <img class="friend-img" src="data:image/png;base64, {friendName.photoURL}"/>
                                    <p class="friend-request-name">{friendName.nickname}</p>
                                </div>
                                <div class="friend-request-buttons">
                                    <div class="friend-request-accept" on:click={() => acceptFriend(userData.uid, friendName.uid)}><Icon src={TiTick} /></div>
                                    <div class="friend-request-reject" on:click={() => rejectFriend(userData.uid, friendName.uid)}><Icon src={TiDelete} /></div>
                                </div>
                            </div>
                            {/each}
                        {/await}
                    {/if}
                </div>
            </div>
        </div>
    </div>
{/if}

<style>
    .profile-info{
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }


    .profile-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10%;
    }

    @media screen and (max-width: 768px) {
        .profile-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 5%;
            justify-content: center;
        }
    }

    .friends-and-requests-container, .profile-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 10%;
    }

    .friend-request-name {
        margin-left: 10px;
        font-size: 12px;
    }

    .friend-request-buttons, .friend-request-data{
        display: flex;
        align-items: center;
        margin: 5px;
    }

    .friend-request-accept, .friend-request-reject, .friend-delete {
        cursor: pointer;
        display: flex;
        align-items: center;
        padding: 5px;
        margin-left: 5px;
        border: 1px solid black;
    }

    .friend-request-accept {
        background-color: green;

        &:hover {
            background-color: darkgreen;
        }
    }

    .friend-request-reject, .friend-delete {
        background-color: red;

        &:hover {
            background-color: darkred;
        }
    }

    .friend-img {
        width: 40px;
    }

    .update-profile-and-fcode-container {
        display: flex;
        align-items: flex-start;
        justify-content: center;
        gap: 10%;
        margin-top: 5%;
        width: 100%;
    }

    @media screen and (max-width: 768px) {
        .update-profile-and-fcode-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 5%;
            justify-content: center;
        }
    }

    .update-profile-container, .friend-code-container, .friend-requests-container, .friends-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border: 3px solid #000000;
        background-color: darkkhaki;
        border-radius: 15px;
        margin: 20px 5px 5px 5px;
        padding: 10px;
        width: 100%;
    }

    .profile-frame {
        display: flex;
        width: 150px;
        height: 150px;
        justify-content: center;
        align-items: center;
        background-color: white;
        border: 3px solid black;
        border-radius: 100%;
        margin-top: 10%;
    }
    .user-photo {
        width: 75%;
        max-width: 65px;
    }

    .user-photo-uploaded {
        width: 75%;
        max-width: 200px;
        margin-top: 10%;
    }

    .user-name {
        font-size: 20px;
        color: white;
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
    }

    .user-email {
        font-size: 14px;
        color: white;
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
    }

    .friend-code-title-copy {
        display: flex;
    }

    .friend-code-copy-icon {
        margin-left: 5px;
        cursor: pointer;
        display: flex;
        align-items: center;
    }

    .friend-code-title, .friend-input-title, .update-profile-title {
        margin-top: 5px;
        text-decoration: underline;
        font-size: 16px;
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
    }

    .friend-code {
        margin-top: 5px;
        font-size: 12px;
        font-family: "Press Start 2P", Roboto, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica Neue, Arial, sans-serif;
        word-break: break-word;
    }

    .friend-request {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 15px;
        padding: 0 10px 0 10px;
    }

    .friend-input, .nickname-input {
        margin-top: 2%;
        width: 100%;
        padding: 5px;
        border: 1px solid black;
    }

    form {
        display: flex;
        align-items: center;
        flex-direction: column;
    }

    input[type="file"] {
        display: none;
    }

    .custom-file-upload {
        margin-top: 15px;
        border: 3px solid black;
        padding: 6px 12px;
        cursor: pointer;
        width: 100%;

        &:hover {
            background-color: black;
            color: white;
        }
    }

    button {
        padding: 5px;
        margin-top: 10%;
        width: 100%;
        background-color: white;
        border: 1px solid black;

        &:hover {
            background-color: black;
            color: white;
        }
    }
</style>