import React, { useState, useEffect } from 'react'
import db from '../auth/Firebase/firebase.init'
import { nanoid } from 'nanoid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-hot-toast';
import Footer from '../shared/Footer';
import ThemeChanger from '../shared/ThemeChanger/ThemeChanger';

export default function Input() {
          const [shorten, setShorten] = useState('');
          const [urlError, setUrlError] = useState('');
          const [urlName, setUrlName] = useState('');
          const [urlNameError, setUrlNameError] = useState('');
          const [loading, setLoading] = useState(false);

          const isValidURL = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(\:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(\#[-a-z\d_]*)?$/i;

          const handleURLError = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const input = e.target.value;
                    // check if input is empty
                    if (input === '') {
                              setUrlError('Please Enter URL..!');
                    } else if (!input.startsWith('https://') && !input.startsWith('http://')) {
                              setUrlError('Please add https or http before..!');
                    } else if (isValidURL.test(input)) {
                              setUrlError('');
                    } else {
                              setUrlError('Please Enter Valid URL..!');
                    }
          }

          const handleURLNameError = (e: React.ChangeEvent<HTMLInputElement>) => {
                    const input = e.target.value;
                    // check if input is empty
                    if (input === '') {
                              setUrlNameError('Please Enter URL Name..!');
                    } else if (input.length < 6) {
                              setUrlNameError('URL Name must be 6 characters long..!');
                    } else {
                              setUrlNameError('');
                    }
          }

          const handleDB = async (e: React.SyntheticEvent) => {
                    e.preventDefault();
                    setLoading(true);

                    const form = e.target as typeof e.target & {
                              URL: { value: string };
                              URLName: { value: string };
                    };

                    // if user enter url without https:// or http:// then add https:// to url
                    const input = form.URL.value;
                    const inputName = form.URLName.value;

                    // check if input is empty
                    if (input === '') {
                              toast.error('Please Enter URL..!', {
                                        icon: "❌",
                                        duration: 3000,
                              });
                              setLoading(false);
                              return;
                    }

                    // check if input is empty
                    if (inputName === '') {
                              toast.error('Please Enter URL Name..!', {
                                        icon: "❌",
                                        duration: 3000,
                              });
                              setLoading(false);
                              return;
                    }

                    // check if url is already exist
                    let query = db.collection('urls').where('url', '==', input);
                    let data = await query.get();
                    if (data.docs.length > 0) {
                              let finalData = data.docs[0].data();
                              setShorten(`${window.location.origin}/${finalData.slug}`);
                              toast.success('URL Already Exist..!', {
                                        icon: "⚠️",
                                        duration: 3000,
                              });
                              // if urlName is already exist then update urlName
                              if (finalData.urlName !== inputName) {
                                        await db.collection('urls').doc(data.docs[0].id).update({
                                                  urlName: inputName,
                                        })
                              }
                              setUrlName(inputName);
                              setLoading(false);
                              return;
                    }

                    if (isValidURL.test(input)) {
                              const slug = nanoid(6);
                              await db.collection('urls').add({
                                        url: input,
                                        slug: slug,
                                        urlName: inputName,
                              })
                              setShorten(`${window.location.origin}/${slug}`);
                              setUrlName(inputName);
                              toast.success('URL Shortened Successfully..!', {
                                        icon: "✅",
                                        duration: 3000,
                              });
                              setLoading(false);
                    }
          }

          // re-render the component without reloading the page
          const handleGenerateAgain = () => {
                    setShorten('');
                    const form = document.querySelector('form') as HTMLFormElement;
                    form.reset();
          }

          useEffect(() => {
                    document.title = urlName ? `${urlName}` : 'Bit.ly URL Shortener';
          }, [urlName]);

          return (
                    <div className='bg-base-100 h-screen'>
                              <div className='flex flex-col justify-center items-center gap-3 pt-12'>
                                        <h1 className='text-3xl'>Bit.ly URL Shortener</h1>
                                        <p>Shorten your URL</p>
                                        <div className='relative w-full md:w-1/2 max-w-xl md:shadow-md'>
                                                  <div className="md:card-body px-3">
                                                            <form onSubmit={handleDB} className="form">
                                                                      <div className="name border rounded-none p-3 relative mt-10">
                                                                                <div className="name-title absolute -top-4 bg-base-100 border rounded-none p-1">
                                                                                          <h3 className="text-xs font-poppins">Put your URL</h3>
                                                                                </div>
                                                                                <div className={`input-group flex items-center my-2 border p-3 rounded-none mt-2 ${urlError && "border-error shadow-error outline-error"}`}>
                                                                                          <div className="icon">
                                                                                                    <i className="bx bxs-pen"></i>
                                                                                          </div>
                                                                                          <input
                                                                                                    type="url"
                                                                                                    name="URL"
                                                                                                    onChange={handleURLError}
                                                                                                    className="form-control outline-none pl-4 w-full bg-transparent"
                                                                                                    placeholder="https://www.example.com"
                                                                                                    autoComplete="off"
                                                                                          />
                                                                                </div>
                                                                                {urlError && (
                                                                                          <small className="flex flex-col pt-2 text-error">
                                                                                                    {urlError}
                                                                                          </small>
                                                                                )}
                                                                      </div>
                                                                      <div className="name border rounded-none p-3 relative mt-10">
                                                                                <div className="name-title absolute -top-4 bg-base-100 border rounded-none p-1">
                                                                                          <h3 className="text-xs font-poppins">Put your URL Name</h3>
                                                                                </div>
                                                                                <div className={`input-group flex items-center my-2 border p-3 rounded-none mt-2 ${urlNameError && "border-error shadow-error outline-error"}`}>
                                                                                          <div className="icon">
                                                                                                    <i className="bx bxs-pen"></i>
                                                                                          </div>
                                                                                          <input
                                                                                                    type="text"
                                                                                                    name="URLName"
                                                                                                    onChange={handleURLNameError}
                                                                                                    className="form-control outline-none pl-4 w-full bg-transparent"
                                                                                                    placeholder="Example"
                                                                                                    autoComplete="off"
                                                                                          />
                                                                                </div>
                                                                                {urlNameError && (
                                                                                          <small className="flex flex-col pt-2 text-error">
                                                                                                    {urlNameError}
                                                                                          </small>
                                                                                )}
                                                                      </div>
                                                                      <div className="card-actions justify-center mt-5">
                                                                                <button className={`btn btn-sm md:btn-md btn-primary text-white rounded-none flex gap-2 ${urlError || urlNameError ? 'btn-disabled' : ''}`}><i className="bx bx-code-alt text-lg"></i> Submit</button>
                                                                      </div>
                                                            </form>
                                                            {
                                                                      shorten && (
                                                                                <div className='flex justify-center mt-4 md:mt-2'>
                                                                                          <button className='btn btn-sm md:btn-md btn-secondary text-white rounded-none flex gap-2' onClick={handleGenerateAgain}><i className="bx bx-expand-horizontal text-lg"></i> Shorten Another</button>
                                                                                </div>
                                                                      )
                                                            }
                                                            {
                                                                      loading ? (

                                                                                <div className='flex flex-col justify-center items-center mt-6'>
                                                                                          <div role="status">
                                                                                                    <svg aria-hidden="true" className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                                                              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                                                                                              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                                                                                    </svg>
                                                                                                    <span className="sr-only">Loading...</span>
                                                                                          </div>
                                                                                </div>

                                                                      ) : (
                                                                                <span>
                                                                                          {
                                                                                                    shorten && (
                                                                                                              <div className='flex flex-col justify-center items-center gap-2 mt-6'>
                                                                                                                        <h1>Your Shorten URL is: </h1>
                                                                                                                        <CopyToClipboard text={shorten} onCopy={
                                                                                                                                  () => {
                                                                                                                                            if (shorten !== '') {
                                                                                                                                                      toast.success('URL Copied To Clipboard..!', {
                                                                                                                                                                icon: "✋",
                                                                                                                                                                duration: 3000,
                                                                                                                                                      });
                                                                                                                                            }
                                                                                                                                  }
                                                                                                                        }>
                                                                                                                                  <span className='md:tooltip md:tooltip-right' data-tip="👍 Click to copy..!">
                                                                                                                                            <kbd className="kbd kbd-xs sm:kbd-sm md:kbd-md lg:kbd-lg select-none rounded-none cursor-pointer p-4 md:p-0">{shorten}</kbd>
                                                                                                                                  </span>
                                                                                                                        </CopyToClipboard>
                                                                                                                        <a href={shorten} className="btn btn-xs rounded-none mt-1" target="_blank" rel="noopener noreferrer">Preview</a>
                                                                                                              </div>
                                                                                                    )
                                                                                          }
                                                                                </span>
                                                                      )
                                                            }
                                                  </div>
                                        </div>
                              </div>

                              <Footer />
                              <ThemeChanger />
                    </div>
          )
}
