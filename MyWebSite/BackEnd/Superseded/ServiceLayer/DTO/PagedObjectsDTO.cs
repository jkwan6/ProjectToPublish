namespace ServiceLayer.DTO
{
    public class PagedObjectsDTO<T>
    {
        public List<T>? Objects { get; set; }
        public int Count { get; set; }
    }
}
