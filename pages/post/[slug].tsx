import { GetStaticProps } from "next";
import Header from "../../components/Header";
import { sanityClient, urlFor } from "../../sanity";
import { Post } from "../../typings";
import PortableText from "react-portable-text"
import {useForm, SubmitHandler} from "react-hook-form";
interface Props {
    post: Post;
}

interface IFormInput {
    _id: string;
    name: string;
    email: string;
    comment: string;
}

const Post = ({post} : Props) => {

    const {register, handleSubmit, formState: {errors}} = useForm<IFormInput>();

  return <main>
      <Header />

      <img className="w-full h-40 object-cover" src={urlFor(post.mainImage).url()!} alt="" />


      <article className="max-w-3xl mx-auto p-5">
          <h1 className="text-3xl mt-10 mb-3">{post.title}</h1>
          <h2 className="text-xl font-light text-gray-500">{post.description}</h2>


          <div className="flex items-center space-x-2">
              <img className="h-10 w-10 rounded-full" src={urlFor(post?.author?.image).url()!} alt={post.author?.name} />
            <p className="font-extralight text-sm">Blog post by <a href="https://lishu.ml"> <span className="text-green-600"> {post.author.name} </span></a> -Published at  {new Date(post._createdAt).toLocaleString()}</p>
          </div>

          <div className="mt-10 ">
              <PortableText 
                 className=""
                dataset="production"
                projectId="ynkgfdlg"
                content={post.body}
                serializers={
                    {
                        h1: (props: any) => <h1 className="text-2xl font-bold my-5" {...props} />,
                        h2: (props: any) => <h2 className="text-xl font-bold my-5" {...props}/>,
                        li: ({children}: any) => <li className="ml-4 list-desc " >{children}</li>,
                        link: ({href, children}: any) => <a className="text-blue-600 hover:underline" href={href}>{children}</a>,
                    }
                }
              />
          </div>
          
      </article>


      <hr className="max-w-lg my-5 mx-auto border border-yellow-500 "/>

      <form className="flex flex-col my-10 p-5 max-w-2xl mx-auto mb-10">

          <h3 className="text-sm text-yellow-500">Enjoy this article</h3>
          <h4 className="text-3xl font-bold">Leave a comment below!</h4>
          <hr  className="py-3 mt-2"/>

          <input {...register("_id")} type="hidden" name="_id" value={post._id} />
          <label className="block mb-5 " htmlFor="">
              <span className="text-gray-700 ">Name</span>
              <input {...register("name", {required: true})} className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500  focus:ring outline-none " type="text" placeholder="Lishu Gupta" />
          </label>
          <label className="block mb-5 " htmlFor="">
              <span className="text-gray-700 ">Email</span>
              <input  {...register("email", {required: true})} className="shadow border rounded py-2 px-3 form-input mt-1 block w-full ring-yellow-500 outline-none focus:ring  " type="email" placeholder="test@mail.com" />
          </label>
          <label className="block mb-5 " htmlFor="">
              <span className="text-gray-700 ">Comment</span>
              <textarea  {...register("comment", {required: true})} className="shadow border rounded py-2 px-3 form-textarea mt-1 block w-full ring-yellow-500 outline-none" placeholder="Comment" rows={8} />
          </label>
          

          {/* error will return when field validation fails */}
          <div className="flex flex-col p-5">
              {errors.name && <span className="text-red-600">Name is required</span>}
              {errors.email && <span className="text-red-600">Email is required</span>}
              {errors.comment && <span className="text-red-600">Comment is required</span>}
              
          </div>

          <input type="submit" className="shadow bg-yellow-500 hover:bg-yellow-400 focus:shadow-outline  focus:outline-none text-white font-bold py-2 rounded cursor-pointer" />
      </form>
  </main>
};

export default Post;


export const getStaticPaths = async () => {
    const query = `*[_type=='post'] {
        _id,
        slug{
            current
        }
    }`

    const posts = await sanityClient.fetch(query);

    const paths = posts.map((post: Post)   => ({
        params: {
            slug: post.slug.current
        }
    }));

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
    const query = `*[_type=='post' && slug.current == $slug][0] {
        _id,
        _createdAt,
        title,
        description,
        mainImage,
        slug,
        body,
        author -> {
            name,
            image
        },
        'comments': *[_type == 'comment' && post.ref ==^._id && approved == true]

    }`

    const post = await sanityClient.fetch(query, {
        slug: params?.slug,
    });

    if(!post) {
        return {
            notFound: true
        }
    }
    return {
        props: {
            post
        },
        revalidate: 60,
    }
}