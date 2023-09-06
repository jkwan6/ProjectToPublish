namespace ServiceLayer.PageService
{
    public class PageService
    {
        private PageRepository _repository;
        public PageService(PageRepository repository)
        {
            _repository = repository;
        }
        
        public void GetByTitle(string title)
        {

        }

    }
}
