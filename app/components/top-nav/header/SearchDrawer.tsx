import {Search} from 'lucide-react';
import {
  PredictiveSearchForm,
  PredictiveSearchResults,
} from '~/components/Search';
import {Button} from '~/components/ui/Button';
import {Drawer} from '~/components/ui/Drawer';

export const SearchDrawer = () => {
  return (
    <Drawer
      content={
        <div className="px-4">
          <PredictiveSearchForm>
            {({fetchResults, inputRef}) => (
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  name="q"
                  onChange={fetchResults}
                  onFocus={fetchResults}
                  placeholder="SEARCH FOR..."
                  ref={inputRef}
                  type="search"
                  className="w-full py-3 px-6 text-lg rounded"
                />
                <Button
                  variant="ghost"
                  size="large"
                  onClick={() => {
                    window.location.href = inputRef?.current?.value
                      ? `/search?q=${inputRef.current.value}`
                      : `/search`;
                  }}
                >
                  <span>SEARCH</span>
                  <Search className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}
          </PredictiveSearchForm>

          <div className="mt-6">
            <PredictiveSearchResults />
          </div>
        </div>
      }
      desc="desc"
      header={<h1>Search</h1>}
      position="right"
      toggleIcon={<Search className="h-6 w-6" />}
    />
  );
};
