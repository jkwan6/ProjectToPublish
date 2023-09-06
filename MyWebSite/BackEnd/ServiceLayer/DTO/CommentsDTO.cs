using DataLayer.Entities;

namespace ServiceLayer.DTO
{
    public class CommentsDTO
    {
        public int Id { get; set; }
        public string? Author { get; set; }
        public DateTime CommentsTime { get; set; }
        public string? CommentsDescription { get; set; }
        public int? ParentId { get; set; }
        public Comments? ParentComment { get; set; }
        public List<Comments>? ChildrenComment { get; set; }
        public int? ChildrenCommentsCount {get; set;}
    }
}
