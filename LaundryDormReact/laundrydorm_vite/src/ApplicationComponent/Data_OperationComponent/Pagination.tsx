import React from 'react'
import style from './Pagination.module.css'

interface PaginationProps {
    totalPosts: number;
    postsPerPage: number;
    onPageChange: (page:number) => void;
    currentPage: number;
}

export const Pagination = ({totalPosts, postsPerPage, onPageChange, currentPage}: PaginationProps) => {
    const pages = [];

    for(let i: number = 1; i <= Math.ceil(totalPosts/postsPerPage); i++){
        pages.push(i);
    }

  return (
    <div className={style.pagination}> {/*Check the css module we imported*/}
        {
            pages.map((page, index) => {
                return <button key = {index} onClick={() => onPageChange(page)}
                 className={page === currentPage ? style.active : ''} >  {/*Look at the css import style*/}
                 {page} </button>
            })
        }
    </div>
  )
}
