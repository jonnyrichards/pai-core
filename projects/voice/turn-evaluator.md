## Turn Evaluator Prompt
Can you write a very prompt designed to elicit a reponse from an LLM about whether a user has finished their input. (It's a service we are considering using as part of a voice application which has produced some early bugs where the assistant is interjecting before the user has finished speaking. We're using an elapsed time metric to decide when should send an audio clip to the voice assistant to respond...we're wondering if we should be cleverer bout it and use a 'current state of the transcript' to decide whether to send or keep listening)
The basic idea behind the prompt - please improve / optimise - is: it would trigger a boolean. I did consider a confidence level rather than a boolean but I was wondering ultimately whether this would be efficient, because ultiamtely another llm would then be having to assess whether the level warranted sending or not. Ultimately because the decision to be made is boolean (send or not send), my current thinking is: boolean is right.
Here are some few shots I imagined including.
They include clearer examples (I'm trying to) and more nebulous ones ('I'm having a few issues'), the point about the nebulous ones being: err on the side of sending rather than not sending. (In this last example, the user might be finished, or they might be about to explain 'what issues'.)
There is the related issue of: if the answer is 'f', how long does the agent wait before sending.
We'll handle that in the main app.
The job is of this prompt service is just to provide a quick answer to guide the main agent.
Speed is of the essence because the voice service has latency issues as it is. 
So it should be extremely compact and optimised for speed.
Can you help write the prompt?

I'm trying to -> f
I'm trying to focus more on psychological -> f
I'm trying to focus more on pyschological safety -> t
I'm having a few issues -> t
I'm having a few issues with -> f
I'm having a few issues with my manager -> t