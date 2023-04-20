
import styles from '../../styles/Admin.module.css';
import { serverTimestamp } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import AuthCheck from '~/components/AuthCheck';
import {firestore, auth} from '~/lib/firebase';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';

const AdminPostEdit = () => {
    return (
        <AuthCheck>
            <PostManager />
        </AuthCheck>
    )
}

export default AdminPostEdit;


const PostManager = () => {
    const [preview, setPreview] = useState(false);

    const router = useRouter();
    const { username, slug } = router.query;
    const postRef = firestore.collection('users').doc(auth.currentUser.uid).collection('posts').doc(slug);
    const [post] = useDocumentData(postRef);
    return (
        <main>
        {post && (
          <>
            <section>
              <h1>{post.title}</h1>
              <p>ID: {post.slug}</p>

              <PostForm postRef={postRef} defaultValues={post} preview={preview} />
            </section>

            <aside>
            <h3>Tools</h3>
              <button onClick={() => setPreview(!preview)}>{preview ? 'Edit' : 'Preview'}</button>
              <Link href={`/${post.username}/${post.slug}`}>
                <button className="btn-blue">Live view</button>
              </Link>
            </aside>
          </>
        )}
      </main>
    )
}


const  PostForm = ({ defaultValues, postRef, preview }) => {
    const { register, handleSubmit, reset, watch } = useForm({ defaultValues, mode: 'onChange' });
    const updatePost = async ({ content, published }) => {
        await postRef.update({
          content,
          published,
          updatedAt: serverTimestamp(),
        });

        reset({ content, published });

        toast.success('Post updated successfully!')
      };

    return (
    <form onSubmit={handleSubmit(updatePost)}>
        {preview && (
          <div className="card">
            <ReactMarkdown>{watch('content')}</ReactMarkdown>
          </div>
        )}

        <div className={preview ? styles.hidden : styles.controls}>

          <textarea {...register("content")}></textarea>

          <fieldset>
            <input className={styles.checkbox} type="checkbox" {...register("published")} />
            <label>Published</label>
          </fieldset>

          <button type="submit" className="btn-green">
            Save Changes
          </button>
        </div>
      </form>
    );
  }
