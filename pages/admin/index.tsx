import { useContext, useState } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';
import AuthCheck from '~/components/AuthCheck';
import PostFeed from '~/components/PostFeed';
import {firestore, auth, postToJSON} from '~/lib/firebase';
import { UserContext } from '~/lib/context';
import kebabCase from 'lodash.kebabcase';
import { serverTimestamp } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
const AdminPostsPage = () => {
    return (
        <main>
            <AuthCheck>
              <PostList />
              <CreateNewPost />
            </AuthCheck>
        </main>
    )
}

export default AdminPostsPage;


const PostList = () => {
    const ref = firestore.collection('users').doc(auth.currentUser.uid).collection('posts');
    const query = ref.orderBy('createdAt');
    const [querySnapshot] = useCollection(query);

    const posts = querySnapshot?.docs.map(postToJSON);

    return (
        <>
            <h1>Manage your Posts</h1>
            <PostFeed posts={posts} admin />
        </>
    );
}

const CreateNewPost = () => {
    const router = useRouter();
    const { username } = useContext(UserContext);
    const [title, setTitle] = useState('');

    const slug = encodeURI(kebabCase(title));

    const isValid = title.length > 3 && title.length < 100;

  // Create a new post in firestore
  const createPost = async (e) => {
    e.preventDefault();
    const uid = auth.currentUser.uid;
    const ref = firestore.collection('users').doc(uid).collection('posts').doc(slug);
    const data = {
      title,
      slug,
      uid,
      username,
      published: false,
      content: '# hello world!',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      heartCount: 0,
    };

    await ref.set(data);

    toast.success('Post created!')

    // Imperative navigation after doc is set
    //router.push(`/admin/${slug}`);

  };

  return (
    <form onSubmit={createPost}>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="My Awesome Article!"
      />
      <p>
        <strong>Slug:</strong> {slug}
      </p>
      <button type="submit" disabled={!isValid} className="btn-green">
        Create New Post
      </button>
    </form>
  );
}
