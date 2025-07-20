using LaundryDormApi.Model.DomainModel;

namespace LaundryDormApi.Repository
{
    public interface IImageRepository
    {
        Task<ImageModel> Upload(ImageModel imageModel, CancellationToken cancellationToken = default);

    }
}
