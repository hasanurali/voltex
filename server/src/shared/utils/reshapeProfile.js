const reshapeProfile = (profile) => {

    if (!profile) {
        return null;
    };

    const rawData = profile.toObject ?
        profile.toObject()
        :
        profile;

    const reshapedProfile = {
        ...rawData,
        avatar: profile.avatar.url,
        coverImage: profile.coverImage.url
    };

    delete reshapedProfile.createdAt;
    delete reshapedProfile.updatedAt;
    delete reshapedProfile.__v;

    return reshapedProfile;
};

export default reshapeProfile;