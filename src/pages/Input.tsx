import React, { useState } from 'react'
import db from '../auth/Firebase/firebase.init'
import { nanoid } from 'nanoid';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-hot-toast';
import Footer from '../shared/Footer';
import URL from '../assets/url.png';
import SUBMIT from '../assets/submit.png';
import Loading from '../shared/Loading/Loading';

export default function Input() {
          const [shorten, setShorten] = useState('');
          const [urlError, setUrlError] = useState('');
          const [loading, setLoading] = useState(false);

          const isValidURL = /^(https?:\/\/)?((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-z\d%_.~+]*)*(\?[;&a-z\d%_.~+=-]*)?(#[-a-z\d_]*)?$/i;

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

          const handleDB = async (e: React.SyntheticEvent) => {
                    e.preventDefault();
                    setLoading(true);

                    const form = e.target as typeof e.target & {
                              URL: { value: string };
                    };

                    // if user enter url without https:// or http:// then add https:// to url
                    const input = form.URL.value;
                    // const inputName = form.URLName.value;

                    // check if input is empty
                    if (input === '') {
                              toast.error('Please Enter URL..!', {
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
                              setLoading(false);
                              return;
                    }

                    if (isValidURL.test(input)) {
                              const slug = nanoid(6);
                              await db.collection('urls').add({
                                        url: input,
                                        slug: slug,
                              })
                              setShorten(`${window.location.origin}/${slug}`);
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

          return (
                    <div className='h-screen'>
                              <div className='flex flex-col justify-center items-center gap-3 pt-12'>
                                        <h1 className='text-3xl md:text-white'>Short.ly URL Shortener</h1>
                                        <p className='md:text-white text-center'>Copy your long URL. Paste it below. Then you got short URL.</p>
                                        <div className='relative w-full md:w-1/2 max-w-xl md:shadow-md lg:shadow-lg rounded-xl'>
                                                  <div className="md:card-body px-3">
                                                            <form onSubmit={handleDB} className="form">
                                                                      <div className="name border rounded-md p-3 relative mt-10">
                                                                                <div className="name-title absolute -top-4 bg-base-100 font-semibold border rounded-md p-1">
                                                                                          <h3 className="text-xs font-poppins select-none">Put your URL</h3>
                                                                                </div>
                                                                                <div className={`input-group flex items-center my-2 border p-3 rounded-md mt-2 ${urlError && "border-error shadow-error outline-error"}`}>
                                                                                          <div className="icon">
                                                                                                    <img src={URL} alt="" className='w-4' />
                                                                                          </div>
                                                                                          <input
                                                                                                    type="url"
                                                                                                    name="URL"
                                                                                                    onChange={handleURLError}
                                                                                                    className="form-control outline-none pl-4 w-full bg-transparent"
                                                                                                    placeholder="Your URL here..!"
                                                                                                    autoComplete="off"
                                                                                          />
                                                                                </div>
                                                                                {urlError && (
                                                                                          <small className="flex flex-col pt-2 text-error">
                                                                                                    {urlError}
                                                                                          </small>
                                                                                )}
                                                                      </div>
                                                                      <div className="card-actions justify-center mt-5">
                                                                                <button className={`btn btn-sm md:btn-md btn-primary text-white rounded-md flex items-center gap-2 ${urlError ? 'btn-disabled cursor-not-allowed' : ''}`}><img src={SUBMIT} alt="" className='w-4' /> Shorten URL</button>
                                                                      </div>
                                                            </form>
                                                            {
                                                                      shorten && (
                                                                                <div className='flex justify-center mt-4 md:mt-2'>
                                                                                          <button className='btn btn-sm md:btn-md btn-primary text-white rounded-md flex gap-2' onClick={handleGenerateAgain}><i className="bx bx-revision text-lg"></i> Shorten Another</button>
                                                                                </div>
                                                                      )
                                                            }
                                                            {
                                                                      loading ? (

                                                                                <div className='flex flex-col justify-center items-center mt-6'>
                                                                                          <Loading />
                                                                                </div>

                                                                      ) : (
                                                                                <span>
                                                                                          {
                                                                                                    shorten && (
                                                                                                              <div className='flex flex-col justify-center items-center gap-2 mt-6'>
                                                                                                                        <h1 className='flex items-center gap-2 pb-2 select-none md:text-white'>Your Shorten URL is <i className='bx bxs-hand-down text-lg'></i> </h1>
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
                                                                                                                                            <kbd className="kbd kbd-sm md:kbd-md lg:kbd-lg select-none rounded-md text-white border-white cursor-pointer p-4 md:p-0 bg-transparent">{shorten}</kbd>
                                                                                                                                  </span>
                                                                                                                        </CopyToClipboard>
                                                                                                                        <span className='md:tooltip md:tooltip-left' data-tip="👍 Click to preview..!">
                                                                                                                                  <a href={shorten} className="btn btn-xs rounded-md mt-1 text-white" target="_blank" rel="noopener noreferrer">Preview</a>
                                                                                                                        </span>
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
                    </div>
          )
}
