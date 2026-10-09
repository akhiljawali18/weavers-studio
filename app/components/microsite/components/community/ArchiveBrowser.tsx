"use client";

import { useId, useState } from "react";
import Image from "next/image";
import ArchiveCard from "./ArchiveCard";
import { kicker } from "../home/typography";
import { S2S_ASSETS } from "../../data/home";
import { archiveCategories, searchFields } from "../../data/community";
import type { ArchiveObject, SearchField } from "../../data/community";

const fieldValues = (object: ArchiveObject): Record<Exclude<SearchField, "all">, string> => ({
  title: `${object.titleItalic}${object.titleRegular}`,
  technique: object.technique,
  collection: object.collection,
  date: object.date,
});

type ArchiveBrowserProps = {
  objects: ArchiveObject[];
};

/**
 * The object count, the "all fields" menu, the search box and the grid they filter.
 * Typing narrows the grid as you go; the menu limits the search to one field, and
 * the box suggests techniques and collections ("pick a category").
 */
const ArchiveBrowser = ({ objects }: ArchiveBrowserProps) => {
  const [field, setField] = useState<SearchField>("all");
  const [query, setQuery] = useState("");
  const ids = { field: useId(), search: useId(), categories: useId() };

  const needle = query.trim().toLowerCase();
  const visible = needle
    ? objects.filter((object) => {
        const values = fieldValues(object);
        const pool = field === "all" ? Object.values(values) : [values[field]];
        return pool.some((value) => value.toLowerCase().includes(needle));
      })
    : objects;

  return (
    <div>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-[80px]">
        <div className="flex h-[47px] items-center justify-between gap-4 border-b border-s2s-line pb-[5px] lg:w-[705px]">
          <p aria-live="polite" className={kicker}>
            {String(visible.length).padStart(2, "0")} objects
          </p>
          <div className="relative flex items-center">
            <label htmlFor={ids.field} className="sr-only">
              Search in
            </label>
            <select
              id={ids.field}
              value={field}
              onChange={(event) => setField(event.target.value as SearchField)}
              className="cursor-pointer appearance-none rounded-sm bg-transparent pr-[43px] text-right text-[16px] lowercase leading-[28px] text-s2s-ink [text-align-last:right] focus:outline-none focus-visible:ring-2 focus-visible:ring-s2s-maroon"
            >
              {searchFields.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <Image
              src={`${S2S_ASSETS}/icon-chevron.svg`}
              alt=""
              width={24}
              height={24}
              unoptimized
              className="pointer-events-none absolute right-[7px] h-[24px] w-[24px] -scale-y-100"
            />
          </div>
        </div>

        <div className="relative flex h-[47px] items-center border-b border-s2s-line pb-[5px] lg:w-[312px]">
          <label htmlFor={ids.search} className="sr-only">
            Search the archive
          </label>
          <input
            id={ids.search}
            type="search"
            list={ids.categories}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="type, or pick a category"
            autoComplete="off"
            className="w-full bg-transparent pr-10 text-[16px] leading-[28px] text-s2s-ink placeholder:text-s2s-ink focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          <datalist id={ids.categories}>
            {archiveCategories.map((category) => (
              <option key={category} value={category} />
            ))}
          </datalist>
          <Image
            src={`${S2S_ASSETS}/icon-search.svg`}
            alt=""
            width={23.774}
            height={16.38}
            unoptimized
            className="pointer-events-none absolute right-0 h-[16.38px] w-[23.774px] max-w-none -rotate-[135deg] -scale-y-100"
          />
        </div>
      </div>

      {visible.length > 0 ? (
        <ul className="mt-10 grid gap-x-[80px] gap-y-12 sm:grid-cols-2 lg:mt-[50px] lg:grid-cols-3 lg:gap-y-[50px]">
          {visible.map((object) => (
            <li key={object.slug}>
              <ArchiveCard {...object} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-10 text-center text-[16px] leading-[28px] text-s2s-muted lg:mt-[50px]">
          No objects match “{query.trim()}”.
        </p>
      )}
    </div>
  );
};

export default ArchiveBrowser;
