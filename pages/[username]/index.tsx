import PostFeed from "~/components/PostFeed";
import UserProfile from "~/components/UserProfile";
import { getUserWithUsername, postToJSON } from "~/lib/firebase";

export const getServerSideProps = async (context) => {
    const { username } = context.query;
    const userDoc  = await getUserWithUsername(username);
    // JSON serializable data
    let user = null;
    let posts = null;

    if(!userDoc) {
        return {
            notFound: true,
        }
    }

    user = userDoc.data();
    const postsQuery = userDoc.ref
        .collection("posts")
        .where("published", "==", true)
        .orderBy("createdAt", "desc")
        .limit(5);
    posts = (await postsQuery.get()).docs.map(postToJSON);
    return {
        props: { user, posts },
    };
}


const UsernamePage = ({user, posts}) => {
    return (
        <div>
            <UserProfile user={user} />
            <PostFeed posts={posts} />
        </div>
    )
}

export default UsernamePage;
